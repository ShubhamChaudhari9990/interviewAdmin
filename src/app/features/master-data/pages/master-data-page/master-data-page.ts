import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AppButton, AppIcon, AppModal } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import {
  InterviewDomain,
  InterviewDomainStatus,
} from '../../../../core/models/interview-domain.model';
import { MOCK_INTERVIEW_DOMAINS } from '../../../../shared/data/interview-domains-mock.data';

type DomainModal = 'closed' | 'create' | 'edit' | 'delete';

interface DomainFormState {
  name: string;
  description: string;
  status: InterviewDomainStatus;
}

const EMPTY_FORM: DomainFormState = {
  name: '',
  description: '',
  status: 'Active',
};

@Component({
  selector: 'app-master-data-page',
  imports: [FormsModule, TableModule, AppIcon, AppButton, AppModal],
  templateUrl: './master-data-page.html',
  styleUrl: './master-data-page.css',
})
export class MasterDataPage {
  readonly icons = AppIcons;

  readonly domains = signal<InterviewDomain[]>([...MOCK_INTERVIEW_DOMAINS]);
  readonly searchQuery = signal('');
  readonly activeModal = signal<DomainModal>('closed');
  readonly editingId = signal<string | null>(null);
  readonly deletingDomain = signal<InterviewDomain | null>(null);
  readonly form = signal<DomainFormState>({ ...EMPTY_FORM });
  readonly formError = signal('');
  readonly previewOpen = signal(true);

  readonly filteredDomains = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const items = [...this.domains()].sort((a, b) => a.sortOrder - b.sortOrder);

    if (!query) {
      return items;
    }

    return items.filter(
      (domain) =>
        domain.name.toLowerCase().includes(query) ||
        domain.description.toLowerCase().includes(query),
    );
  });

  readonly activeCount = computed(
    () => this.domains().filter((domain) => domain.status === 'Active').length,
  );

  readonly formModalOpen = computed(
    () => this.activeModal() === 'create' || this.activeModal() === 'edit',
  );

  readonly deleteModalOpen = computed(() => this.activeModal() === 'delete');

  readonly formModalTitle = computed(() =>
    this.activeModal() === 'edit' ? 'Edit Interview Domain' : 'Add Interview Domain',
  );

  readonly formModalSubtitle = computed(() =>
    this.activeModal() === 'edit'
      ? 'Update how this domain appears in the Type of Interview dropdown.'
      : 'Create a new option for the user-facing Type of Interview dropdown.',
  );

  readonly formSubmitLabel = computed(() =>
    this.activeModal() === 'edit' ? 'Save Changes' : 'Create Domain',
  );

  readonly deleteModalSubtitle = computed(() => {
    const domain = this.deletingDomain();
    return domain
      ? `This removes "${domain.name}" from the Type of Interview dropdown.`
      : 'This domain will be removed from the Type of Interview dropdown.';
  });

  openCreate(): void {
    this.deletingDomain.set(null);
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.activeModal.set('create');
  }

  openEdit(domain: InterviewDomain): void {
    this.deletingDomain.set(null);
    this.editingId.set(domain.id);
    this.form.set({
      name: domain.name,
      description: domain.description,
      status: domain.status,
    });
    this.formError.set('');
    this.activeModal.set('edit');
  }

  openDelete(domain: InterviewDomain): void {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.deletingDomain.set(domain);
    this.activeModal.set('delete');
  }

  closeModal(): void {
    this.activeModal.set('closed');
    this.editingId.set(null);
    this.deletingDomain.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
  }

  updateFormField<K extends keyof DomainFormState>(
    field: K,
    value: DomainFormState[K],
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
    this.formError.set('');
  }

  saveDomain(): void {
    const draft = this.form();
    const name = draft.name.trim();

    if (!name) {
      this.formError.set('Domain name is required.');
      return;
    }

    const duplicate = this.domains().some(
      (domain) =>
        domain.name.toLowerCase() === name.toLowerCase() &&
        domain.id !== this.editingId(),
    );

    if (duplicate) {
      this.formError.set('A domain with this name already exists.');
      return;
    }

    if (this.activeModal() === 'edit' && this.editingId()) {
      const id = this.editingId()!;
      this.domains.update((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                name,
                description: draft.description.trim(),
                status: draft.status,
                updatedAt: 'Just now',
              }
            : item,
        ),
      );
    } else {
      const nextOrder =
        this.domains().reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1;

      this.domains.update((items) => [
        ...items,
        {
          id: `dom-${Date.now()}`,
          name,
          description: draft.description.trim() || 'Custom interview domain.',
          status: draft.status,
          sortOrder: nextOrder,
          usageCount: 0,
          updatedAt: 'Just now',
        },
      ]);
    }

    this.closeModal();
  }

  confirmDelete(): void {
    const domain = this.deletingDomain();
    if (!domain) {
      return;
    }

    this.domains.update((items) => items.filter((item) => item.id !== domain.id));
    this.closeModal();
  }

  toggleStatus(domain: InterviewDomain): void {
    this.domains.update((items) =>
      items.map((item) =>
        item.id === domain.id
          ? {
              ...item,
              status: item.status === 'Active' ? 'Inactive' : 'Active',
              updatedAt: 'Just now',
            }
          : item,
      ),
    );
  }

  statusClass(status: InterviewDomainStatus): string {
    return status === 'Active' ? 'admin-badge--active' : 'admin-badge--inactive';
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }
}
