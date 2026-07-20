import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqsFirestoreService } from '../../../../core/services/faqs-firestore.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { ToastService } from '../../../../core/services/toast.service';
import type { FaqCategory, FaqEntry, FaqEntryForm } from '../../../../core/models/faq.model';
import { AppButton, AppIcon, AppLoader, AppModal } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';

type FaqModal = 'closed' | 'create' | 'edit' | 'delete';

const EMPTY_FORM: FaqEntryForm = {
  question: '',
  answer: '',
};

@Component({
  selector: 'app-faq-page',
  imports: [FormsModule, AppButton, AppIcon, AppLoader, AppModal],
  templateUrl: './faq-page.html',
})
export class FaqPage implements OnInit {
  private readonly faqsFirestore = inject(FaqsFirestoreService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  readonly icons = AppIcons;

  readonly categories = signal<FaqCategory[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal('');
  readonly activeCategoryId = signal('');
  readonly openQuestionIndex = signal<number | null>(null);
  readonly searchQuery = signal('');

  readonly activeModal = signal<FaqModal>('closed');
  readonly editingIndex = signal<number | null>(null);
  readonly deletingIndex = signal<number | null>(null);
  readonly form = signal<FaqEntryForm>({ ...EMPTY_FORM });
  readonly formError = signal('');

  readonly activeCategory = computed(() => {
    const id = this.activeCategoryId();
    return this.categories().find((category) => category.id === id) ?? null;
  });

  readonly filteredQuestions = computed(() => {
    const category = this.activeCategory();
    if (!category) {
      return [];
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return category.questions.map((entry, index) => ({ entry, index }));
    }

    return category.questions
      .map((entry, index) => ({ entry, index }))
      .filter(
        ({ entry }) =>
          entry.question.toLowerCase().includes(query) ||
          entry.answer.toLowerCase().includes(query),
      );
  });

  readonly totalQuestionCount = computed(() =>
    this.categories().reduce((sum, category) => sum + category.questions.length, 0),
  );

  readonly formModalOpen = computed(
    () => this.activeModal() === 'create' || this.activeModal() === 'edit',
  );

  readonly deleteModalOpen = computed(() => this.activeModal() === 'delete');

  readonly formModalTitle = computed(() =>
    this.activeModal() === 'edit' ? 'Edit question' : 'Add question',
  );

  readonly formModalSubtitle = computed(() => {
    return this.activeModal() === 'edit'
      ? 'Update the question and answer for the selected category.'
      : 'This question will be saved under the category shown below.';
  });

  readonly deletingEntry = computed(() => {
    const category = this.activeCategory();
    const index = this.deletingIndex();
    if (!category || index === null) {
      return null;
    }
    return category.questions[index] ?? null;
  });

  readonly deleteModalSubtitle = computed(() => {
    const entry = this.deletingEntry();
    const categoryTitle = this.activeCategory()?.title ?? 'FAQ';
    if (!entry) {
      return 'This question will be removed from the FAQ.';
    }
    return `This removes “${entry.question}” from ${categoryTitle}.`;
  });

  ngOnInit(): void {
    void this.loadFaqs();
  }

  async loadFaqs(): Promise<void> {
    const isRetry = Boolean(this.loadError());
    this.isLoading.set(true);
    this.loadError.set('');

    try {
      const categories = await this.faqsFirestore.loadCategories();
      this.categories.set(categories);

      const currentId = this.activeCategoryId();
      const stillExists = categories.some((category) => category.id === currentId);
      this.activeCategoryId.set(stillExists ? currentId : categories[0]?.id ?? '');
      this.openQuestionIndex.set(null);

      if (isRetry) {
        this.toastService.success('FAQs loaded', 'FAQ content was refreshed from the database.');
      }
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to load FAQs.');
      this.loadError.set(message);
      this.toastService.error('Load failed', message);
    } finally {
      this.isLoading.set(false);
    }
  }

  setCategory(categoryId: string): void {
    this.activeCategoryId.set(categoryId);
    this.searchQuery.set('');
    this.openQuestionIndex.set(null);
    this.closeModal();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.openQuestionIndex.set(null);
  }

  toggleQuestion(index: number): void {
    this.openQuestionIndex.update((current) => (current === index ? null : index));
  }

  openCreate(): void {
    if (!this.activeCategory()) {
      return;
    }

    this.editingIndex.set(null);
    this.deletingIndex.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.activeModal.set('create');
  }

  openEdit(index: number, entry: FaqEntry): void {
    this.deletingIndex.set(null);
    this.editingIndex.set(index);
    this.form.set({
      question: entry.question,
      answer: entry.answer,
    });
    this.formError.set('');
    this.activeModal.set('edit');
  }

  openDelete(index: number): void {
    this.editingIndex.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.deletingIndex.set(index);
    this.activeModal.set('delete');
  }

  closeModal(): void {
    this.activeModal.set('closed');
    this.editingIndex.set(null);
    this.deletingIndex.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
  }

  updateFormField<K extends keyof FaqEntryForm>(field: K, value: FaqEntryForm[K]): void {
    this.form.update((current) => ({ ...current, [field]: value }));
    this.formError.set('');
  }

  async saveEntry(): Promise<void> {
    const category = this.activeCategory();
    if (!category) {
      return;
    }

    const question = this.form().question.trim();
    const answer = this.form().answer.trim();

    if (!question) {
      this.formError.set('Question is required.');
      return;
    }

    if (!answer) {
      this.formError.set('Answer is required.');
      return;
    }

    const nextQuestions = [...category.questions];
    const isEdit = this.activeModal() === 'edit' && this.editingIndex() !== null;

    if (isEdit) {
      nextQuestions[this.editingIndex()!] = { question, answer };
    } else {
      nextQuestions.push({ question, answer });
    }

    const saved = await this.persistQuestions(
      category.id,
      nextQuestions,
      isEdit ? 'Question updated successfully.' : 'Question added successfully.',
    );

    if (saved) {
      this.closeModal();
    }
  }

  async confirmDelete(): Promise<void> {
    const category = this.activeCategory();
    const index = this.deletingIndex();
    if (!category || index === null) {
      return;
    }

    const removed = category.questions[index];
    const nextQuestions = category.questions.filter((_, entryIndex) => entryIndex !== index);

    const saved = await this.persistQuestions(
      category.id,
      nextQuestions,
      removed ? `Removed “${removed.question}”.` : 'Question deleted successfully.',
    );

    if (saved) {
      this.closeModal();
      this.openQuestionIndex.set(null);
    }
  }

  private async persistQuestions(
    categoryId: string,
    questions: FaqEntry[],
    successMessage: string,
  ): Promise<boolean> {
    this.isSaving.set(true);
    this.loaderService.show('Saving FAQ...');

    try {
      await this.faqsFirestore.saveCategoryQuestions(categoryId, questions);
      this.categories.update((categories) =>
        categories.map((category) =>
          category.id === categoryId ? { ...category, questions } : category,
        ),
      );
      this.toastService.success('FAQ saved', successMessage);
      return true;
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to save FAQ changes.');
      this.toastService.error('Save failed', message);
      await this.loadFaqs();
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
}
