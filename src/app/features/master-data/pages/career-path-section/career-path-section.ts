import { LowerCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AppButton, AppDropdown, AppIcon, AppModal } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import {
  CareerCategory,
  CareerDomain,
  CareerPathLevel,
  CareerSpecialization,
  CareerTargetRole,
  MasterDataStatus,
} from '../../../../core/models/career-path.model';
import { MOCK_CAREER_PATH } from '../../../../shared/data/career-path-mock.data';

type ItemModal = 'closed' | 'create' | 'edit' | 'delete';

interface ItemFormState {
  name: string;
  description: string;
  status: MasterDataStatus;
  parentId: string;
}

const EMPTY_FORM: ItemFormState = {
  name: '',
  description: '',
  status: 'Active',
  parentId: '',
};

interface LevelConfig {
  label: string;
  singular: string;
  icon: (typeof AppIcons)[keyof typeof AppIcons];
  parentLevel: CareerPathLevel | null;
  parentLabel: string | null;
  addLabel: string;
}

const LEVEL_ORDER: CareerPathLevel[] = ['domain', 'category', 'specialization', 'targetRole'];

const LEVEL_CONFIG: Record<CareerPathLevel, LevelConfig> = {
  domain: {
    label: 'Domain',
    singular: 'domain',
    icon: AppIcons.database,
    parentLevel: null,
    parentLabel: null,
    addLabel: 'Add Domain',
  },
  category: {
    label: 'Category',
    singular: 'category',
    icon: AppIcons.wrench,
    parentLevel: 'domain',
    parentLabel: 'Domain',
    addLabel: 'Add Category',
  },
  specialization: {
    label: 'Specialization',
    singular: 'specialization',
    icon: AppIcons.eye,
    parentLevel: 'category',
    parentLabel: 'Category',
    addLabel: 'Add Specialization',
  },
  targetRole: {
    label: 'Target Role',
    singular: 'target role',
    icon: AppIcons.shield,
    parentLevel: 'specialization',
    parentLabel: 'Specialization',
    addLabel: 'Add Target Role',
  },
};

type CareerPathItem = CareerDomain | CareerCategory | CareerSpecialization | CareerTargetRole;

@Component({
  selector: 'app-career-path-section',
  imports: [LowerCasePipe, FormsModule, TableModule, AppIcon, AppButton, AppDropdown, AppModal],
  templateUrl: './career-path-section.html',
})
export class CareerPathSection {
  readonly icons = AppIcons;
  readonly levels = LEVEL_ORDER;
  readonly levelConfig = LEVEL_CONFIG;

  readonly domains = signal<CareerDomain[]>([...MOCK_CAREER_PATH.domains]);
  readonly categories = signal<CareerCategory[]>([...MOCK_CAREER_PATH.categories]);
  readonly specializations = signal<CareerSpecialization[]>([...MOCK_CAREER_PATH.specializations]);
  readonly targetRoles = signal<CareerTargetRole[]>([...MOCK_CAREER_PATH.targetRoles]);

  readonly activeLevel = signal<CareerPathLevel>('domain');
  readonly parentFilterId = signal('');
  readonly searchQuery = signal('');
  readonly activeModal = signal<ItemModal>('closed');
  readonly editingId = signal<string | null>(null);
  readonly deletingItem = signal<CareerPathItem | null>(null);
  readonly form = signal<ItemFormState>({ ...EMPTY_FORM });
  readonly formError = signal('');
  readonly previewOpen = signal(true);

  readonly levelMeta = computed(() => LEVEL_CONFIG[this.activeLevel()]);

  readonly parentOptions = computed(() => {
    const level = this.activeLevel();
    const config = LEVEL_CONFIG[level];
    if (!config.parentLevel) {
      return [];
    }

    return this.getActiveParents(config.parentLevel).map((item) => ({
      label: item.name,
      value: item.id,
    }));
  });

  readonly parentFilterOptions = computed(() => {
    const parentLabel = this.levelMeta().parentLabel;
    return [
      { label: `All ${parentLabel}s`, value: '' },
      ...this.parentOptions(),
    ];
  });

  readonly filteredItems = computed(() => {
    const level = this.activeLevel();
    const query = this.searchQuery().trim().toLowerCase();
    const parentId = this.parentFilterId();
    let items = [...this.getItemsForLevel(level)].sort((a, b) => a.sortOrder - b.sortOrder);

    if (parentId) {
      items = items.filter((item) => this.getParentId(item) === parentId);
    }

    if (!query) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        this.getParentName(item).toLowerCase().includes(query),
    );
  });

  readonly totalCount = computed(() => this.getItemsForLevel(this.activeLevel()).length);

  readonly activeCount = computed(
    () => this.getItemsForLevel(this.activeLevel()).filter((item) => item.status === 'Active').length,
  );

  readonly formModalOpen = computed(
    () => this.activeModal() === 'create' || this.activeModal() === 'edit',
  );

  readonly deleteModalOpen = computed(() => this.activeModal() === 'delete');

  readonly formModalTitle = computed(() => {
    const meta = this.levelMeta();
    return this.activeModal() === 'edit' ? `Edit ${meta.label}` : meta.addLabel;
  });

  readonly formModalSubtitle = computed(() => {
    const meta = this.levelMeta();
    const action = this.activeModal() === 'edit' ? 'Update how this' : 'Create a new';
    return `${action} ${meta.singular} appears in the Career Selection dropdown.`;
  });

  readonly formSubmitLabel = computed(() =>
    this.activeModal() === 'edit' ? 'Save Changes' : `Create ${this.levelMeta().label}`,
  );

  readonly deleteModalSubtitle = computed(() => {
    const item = this.deletingItem();
    const label = this.levelMeta().label.toLowerCase();
    return item
      ? `This removes "${item.name}" from the ${label} dropdown.`
      : `This item will be removed from the ${label} dropdown.`;
  });

  readonly previewDomains = computed(() =>
    [...this.domains()]
      .filter((item) => item.status === 'Active')
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );

  readonly previewCategories = computed(() => {
    const domain = this.previewDomains()[0];
    if (!domain) {
      return [];
    }

    return [...this.categories()]
      .filter((item) => item.status === 'Active' && item.domainId === domain.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  readonly previewSpecializations = computed(() => {
    const category = this.previewCategories()[0];
    if (!category) {
      return [];
    }

    return [...this.specializations()]
      .filter((item) => item.status === 'Active' && item.categoryId === category.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  readonly previewTargetRoles = computed(() => {
    const specialization = this.previewSpecializations()[0];
    if (!specialization) {
      return [];
    }

    return [...this.targetRoles()]
      .filter((item) => item.status === 'Active' && item.specializationId === specialization.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  readonly selectedPath = computed(() => {
    const parts = [
      this.previewDomains()[0]?.name,
      this.previewCategories()[0]?.name,
      this.previewSpecializations()[0]?.name,
      this.previewTargetRoles()[0]?.name,
    ].filter(Boolean);

    return parts.join(' > ');
  });

  setLevel(level: CareerPathLevel): void {
    this.activeLevel.set(level);
    this.parentFilterId.set('');
    this.searchQuery.set('');
    this.closeModal();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  openCreate(): void {
    const level = this.activeLevel();
    const config = LEVEL_CONFIG[level];
    const defaultParent = config.parentLevel
      ? this.parentFilterId() || this.parentOptions()[0]?.value || ''
      : '';

    this.deletingItem.set(null);
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM, parentId: defaultParent });
    this.formError.set('');
    this.activeModal.set('create');
  }

  openEdit(item: CareerPathItem): void {
    this.deletingItem.set(null);
    this.editingId.set(item.id);
    this.form.set({
      name: item.name,
      description: item.description,
      status: item.status,
      parentId: this.getParentId(item),
    });
    this.formError.set('');
    this.activeModal.set('edit');
  }

  openDelete(item: CareerPathItem): void {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.deletingItem.set(item);
    this.activeModal.set('delete');
  }

  closeModal(): void {
    this.activeModal.set('closed');
    this.editingId.set(null);
    this.deletingItem.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
  }

  updateFormField<K extends keyof ItemFormState>(field: K, value: ItemFormState[K]): void {
    this.form.update((current) => ({ ...current, [field]: value }));
    this.formError.set('');
  }

  saveItem(): void {
    const level = this.activeLevel();
    const config = LEVEL_CONFIG[level];
    const draft = this.form();
    const name = draft.name.trim();

    if (!name) {
      this.formError.set(`${config.label} name is required.`);
      return;
    }

    if (config.parentLevel && !draft.parentId) {
      this.formError.set(`${config.parentLabel} is required.`);
      return;
    }

    const duplicate = this.getItemsForLevel(level).some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== this.editingId() &&
        (!config.parentLevel || this.getParentId(item) === draft.parentId),
    );

    if (duplicate) {
      this.formError.set(`A ${config.singular} with this name already exists at this level.`);
      return;
    }

    if (this.activeModal() === 'edit' && this.editingId()) {
      this.updateItem(level, this.editingId()!, name, draft);
    } else {
      this.createItem(level, name, draft);
    }

    this.closeModal();
  }

  confirmDelete(): void {
    const item = this.deletingItem();
    if (!item) {
      return;
    }

    const level = this.activeLevel();
    this.removeItem(level, item.id);
    this.closeModal();
  }

  toggleStatus(item: CareerPathItem): void {
    const level = this.activeLevel();
    this.patchItem(level, item.id, {
      status: item.status === 'Active' ? 'Inactive' : 'Active',
      updatedAt: 'Just now',
    });
  }

  statusClass(status: MasterDataStatus): string {
    return status === 'Active'
      ? 'bg-[var(--success-bg)] text-[var(--success)]'
      : 'bg-[var(--danger-bg)] text-[var(--danger)]';
  }

  getParentName(item: CareerPathItem): string {
    const level = this.activeLevel();
    const config = LEVEL_CONFIG[level];
    if (!config.parentLevel) {
      return '—';
    }

    const parentId = this.getParentId(item);
    const parent = this.getActiveParents(config.parentLevel).find((entry) => entry.id === parentId);
    return parent?.name ?? '—';
  }

  hasParentColumn(): boolean {
    return LEVEL_CONFIG[this.activeLevel()].parentLevel !== null;
  }

  private getItemsForLevel(level: CareerPathLevel): CareerPathItem[] {
    switch (level) {
      case 'domain':
        return this.domains();
      case 'category':
        return this.categories();
      case 'specialization':
        return this.specializations();
      case 'targetRole':
        return this.targetRoles();
    }
  }

  private getActiveParents(level: CareerPathLevel): CareerPathItem[] {
    return this.getItemsForLevel(level)
      .filter((item) => item.status === 'Active')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  private getParentId(item: CareerPathItem): string {
    if ('domainId' in item) {
      return item.domainId;
    }
    if ('categoryId' in item) {
      return item.categoryId;
    }
    if ('specializationId' in item) {
      return item.specializationId;
    }
    return '';
  }

  private createItem(level: CareerPathLevel, name: string, draft: ItemFormState): void {
    const nextOrder =
      this.getItemsForLevel(level).reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1;

    const base = {
      id: `cp-${level}-${Date.now()}`,
      name,
      description: draft.description.trim() || `Custom ${LEVEL_CONFIG[level].singular}.`,
      status: draft.status,
      sortOrder: nextOrder,
      usageCount: 0,
      updatedAt: 'Just now',
    };

    switch (level) {
      case 'domain':
        this.domains.update((items) => [...items, base]);
        break;
      case 'category':
        this.categories.update((items) => [...items, { ...base, domainId: draft.parentId }]);
        break;
      case 'specialization':
        this.specializations.update((items) => [...items, { ...base, categoryId: draft.parentId }]);
        break;
      case 'targetRole':
        this.targetRoles.update((items) => [
          ...items,
          { ...base, specializationId: draft.parentId },
        ]);
        break;
    }
  }

  private updateItem(
    level: CareerPathLevel,
    id: string,
    name: string,
    draft: ItemFormState,
  ): void {
    const patch = {
      name,
      description: draft.description.trim(),
      status: draft.status,
      updatedAt: 'Just now',
    };

    switch (level) {
      case 'domain':
        this.domains.update((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        );
        break;
      case 'category':
        this.categories.update((items) =>
          items.map((item) =>
            item.id === id ? { ...item, ...patch, domainId: draft.parentId } : item,
          ),
        );
        break;
      case 'specialization':
        this.specializations.update((items) =>
          items.map((item) =>
            item.id === id ? { ...item, ...patch, categoryId: draft.parentId } : item,
          ),
        );
        break;
      case 'targetRole':
        this.targetRoles.update((items) =>
          items.map((item) =>
            item.id === id ? { ...item, ...patch, specializationId: draft.parentId } : item,
          ),
        );
        break;
    }
  }

  private patchItem(
    level: CareerPathLevel,
    id: string,
    patch: Partial<CareerPathItem>,
  ): void {
    switch (level) {
      case 'domain':
        this.domains.update((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        );
        break;
      case 'category':
        this.categories.update((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        );
        break;
      case 'specialization':
        this.specializations.update((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        );
        break;
      case 'targetRole':
        this.targetRoles.update((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        );
        break;
    }
  }

  private removeItem(level: CareerPathLevel, id: string): void {
    switch (level) {
      case 'domain': {
        const categoryIds = this.categories()
          .filter((item) => item.domainId === id)
          .map((item) => item.id);
        const specializationIds = this.specializations()
          .filter((item) => categoryIds.includes(item.categoryId))
          .map((item) => item.id);

        this.domains.update((items) => items.filter((item) => item.id !== id));
        this.categories.update((items) => items.filter((item) => item.domainId !== id));
        this.specializations.update((items) =>
          items.filter((item) => !categoryIds.includes(item.categoryId)),
        );
        this.targetRoles.update((items) =>
          items.filter((item) => !specializationIds.includes(item.specializationId)),
        );
        break;
      }
      case 'category': {
        const specializationIds = this.specializations()
          .filter((item) => item.categoryId === id)
          .map((item) => item.id);

        this.categories.update((items) => items.filter((item) => item.id !== id));
        this.specializations.update((items) => items.filter((item) => item.categoryId !== id));
        this.targetRoles.update((items) =>
          items.filter((item) => !specializationIds.includes(item.specializationId)),
        );
        break;
      }
      case 'specialization':
        this.specializations.update((items) => items.filter((item) => item.id !== id));
        this.targetRoles.update((items) => items.filter((item) => item.specializationId !== id));
        break;
      case 'targetRole':
        this.targetRoles.update((items) => items.filter((item) => item.id !== id));
        break;
    }
  }
}
