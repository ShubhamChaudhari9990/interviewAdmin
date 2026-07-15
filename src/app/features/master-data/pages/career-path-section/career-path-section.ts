import { LowerCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AppButton, AppDropdown, AppIcon, AppLoader, AppModal } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import {
  CareerCategory,
  CareerDomain,
  CareerPathLevel,
  CareerSpecialization,
  CareerTargetRole,
  MasterDataStatus,
} from '../../../../core/models/career-path.model';
import { InterviewType } from '../../../../core/models/interview-type.model';
import { InterviewDomainFirestoreService } from '../../../../core/services/interview-domain-firestore.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { ToastService } from '../../../../core/services/toast.service';

type MasterDataLevel = CareerPathLevel | 'interviewType';

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
  parentLevel: MasterDataLevel | null;
  parentLabel: string | null;
  addLabel: string;
}

const LEVEL_ORDER: MasterDataLevel[] = [
  'interviewType',
  'domain',
  'category',
  'specialization',
  'targetRole',
];

const LEVEL_CONFIG: Record<MasterDataLevel, LevelConfig> = {
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
  interviewType: {
    label: 'Interview Type',
    singular: 'interview type',
    icon: AppIcons.fileText,
    parentLevel: 'domain',
    parentLabel: 'Domain',
    addLabel: 'Add Interview Type',
  },
};

type CareerPathItem = CareerDomain | CareerCategory | CareerSpecialization | CareerTargetRole;
type MasterDataItem = CareerPathItem | InterviewType;

function formatInterviewTypeLabel(type: string): string {
  const trimmed = type.trim();
  if (!trimmed) {
    return '';
  }

  if (/[\s-]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

@Component({
  selector: 'app-career-path-section',
  imports: [LowerCasePipe, FormsModule, TableModule, AppIcon, AppButton, AppDropdown, AppLoader, AppModal],
  templateUrl: './career-path-section.html',
})
export class CareerPathSection implements OnInit {
  private readonly interviewDomainFirestore = inject(InterviewDomainFirestoreService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  readonly icons = AppIcons;
  readonly levels = LEVEL_ORDER;
  readonly levelConfig = LEVEL_CONFIG;

  readonly domains = signal<CareerDomain[]>([]);
  readonly categories = signal<CareerCategory[]>([]);
  readonly specializations = signal<CareerSpecialization[]>([]);
  readonly targetRoles = signal<CareerTargetRole[]>([]);
  readonly interviewTypes = signal<InterviewType[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal('');

  readonly activeLevel = signal<MasterDataLevel>('interviewType');
  readonly parentFilterId = signal('');
  readonly searchQuery = signal('');
  readonly activeModal = signal<ItemModal>('closed');
  readonly editingId = signal<string | null>(null);
  readonly deletingItem = signal<MasterDataItem | null>(null);
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
    if (this.activeLevel() === 'interviewType') {
      return `${action} ${meta.singular} appears in the Type of Interview dropdown.`;
    }
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

  readonly previewInterviewTypes = computed(() => {
    const domain = this.previewDomains()[0];
    if (!domain) {
      return [];
    }

    return [...this.interviewTypes()]
      .filter((item) => item.status === 'Active' && item.domainId === domain.id)
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

  ngOnInit(): void {
    void this.loadMasterData();
  }

  async loadMasterData(): Promise<void> {
    const isRetry = Boolean(this.loadError());
    this.isLoading.set(true);
    this.loadError.set('');

    try {
      const data = await this.interviewDomainFirestore.loadMasterData();
      this.domains.set(data.careerPath.domains);
      this.categories.set(data.careerPath.categories);
      this.specializations.set(data.careerPath.specializations);
      this.targetRoles.set(data.careerPath.targetRoles);
      this.interviewTypes.set(data.interviewTypes);

      if (isRetry) {
        this.toastService.success('Data loaded', 'Master data was refreshed from the database.');
      }
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to load master data.');
      this.loadError.set(message);
      this.toastService.error('Load failed', message);
    } finally {
      this.isLoading.set(false);
    }
  }

  setLevel(level: MasterDataLevel): void {
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

  openEdit(item: MasterDataItem): void {
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

  openDelete(item: MasterDataItem): void {
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

  async saveItem(): Promise<void> {
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

    const isEdit = this.activeModal() === 'edit' && Boolean(this.editingId());
    if (isEdit) {
      this.updateItem(level, this.editingId()!, name, draft);
    } else {
      this.createItem(level, name, draft);
    }

    const saved = await this.persistMasterData(
      isEdit
        ? `${config.label} updated successfully.`
        : `${config.label} created successfully.`,
    );
    if (saved) {
      this.closeModal();
    }
  }

  async confirmDelete(): Promise<void> {
    const item = this.deletingItem();
    if (!item) {
      return;
    }

    const level = this.activeLevel();
    const config = LEVEL_CONFIG[level];
    const itemName = this.displayItemName(item);
    this.removeItem(level, item.id);

    const saved = await this.persistMasterData(`${config.label} "${itemName}" deleted successfully.`);
    if (saved) {
      this.closeModal();
    }
  }

  async toggleStatus(item: MasterDataItem): Promise<void> {
    const level = this.activeLevel();
    const config = LEVEL_CONFIG[level];
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    this.patchItem(level, item.id, {
      status: nextStatus,
      updatedAt: 'Just now',
    });
    await this.persistMasterData(
      `${config.label} marked as ${nextStatus}.`,
      `${this.displayItemName(item)} is now ${nextStatus.toLowerCase()}.`,
    );
  }

  statusClass(status: MasterDataStatus): string {
    return status === 'Active'
      ? 'bg-[var(--success-bg)] text-[var(--success)]'
      : 'bg-[var(--danger-bg)] text-[var(--danger)]';
  }

  getParentName(item: MasterDataItem): string {
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

  displayItemName(item: MasterDataItem): string {
    if (this.activeLevel() === 'interviewType') {
      return formatInterviewTypeLabel(item.name);
    }
    return item.name;
  }

  canCreateItem(): boolean {
    if (this.isLoading() || this.isSaving()) {
      return false;
    }

    if (this.activeLevel() === 'interviewType') {
      return Boolean(this.parentFilterId() || this.parentOptions()[0]?.value);
    }

    return true;
  }

  private getItemsForLevel(level: MasterDataLevel): MasterDataItem[] {
    switch (level) {
      case 'domain':
        return this.domains();
      case 'category':
        return this.categories();
      case 'specialization':
        return this.specializations();
      case 'targetRole':
        return this.targetRoles();
      case 'interviewType':
        return this.interviewTypes();
    }
  }

  private getActiveParents(level: MasterDataLevel): MasterDataItem[] {
    return this.getItemsForLevel(level)
      .filter((item) => item.status === 'Active')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  private getParentId(item: MasterDataItem): string {
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

  private createItem(level: MasterDataLevel, name: string, draft: ItemFormState): void {
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
      case 'interviewType':
        this.interviewTypes.update((items) => [
          ...items,
          { ...base, domainId: draft.parentId },
        ]);
        break;
    }
  }

  private updateItem(
    level: MasterDataLevel,
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
      case 'interviewType':
        this.interviewTypes.update((items) =>
          items.map((item) =>
            item.id === id ? { ...item, ...patch, domainId: draft.parentId } : item,
          ),
        );
        break;
    }
  }

  private patchItem(
    level: MasterDataLevel,
    id: string,
    patch: Partial<MasterDataItem>,
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
      case 'interviewType':
        this.interviewTypes.update((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        );
        break;
    }
  }

  private async persistMasterData(
    successTitle?: string,
    successMessage?: string,
  ): Promise<boolean> {
    this.isSaving.set(true);
    this.loaderService.show('Saving changes...');

    try {
      await this.interviewDomainFirestore.saveMasterData(
        {
          domains: this.domains(),
          categories: this.categories(),
          specializations: this.specializations(),
          targetRoles: this.targetRoles(),
        },
        this.interviewTypes(),
      );

      this.toastService.success(
        successTitle ?? 'Changes saved',
        successMessage ?? 'Master data was updated in the database.',
      );
      return true;
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to save master data.');
      this.toastService.error('Save failed', message);
      await this.loadMasterData();
      return false;
    } finally {
      this.isSaving.set(false);
      this.loaderService.hide();
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }

  private removeItem(level: MasterDataLevel, id: string): void {
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
        this.interviewTypes.update((items) => items.filter((item) => item.domainId !== id));
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
      case 'interviewType':
        this.interviewTypes.update((items) => items.filter((item) => item.id !== id));
        break;
    }
  }
}
