import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { FAQS_COLLECTION } from '../constants/firestore-collections';
import type { FaqCategory, FaqEntry } from '../models/faq.model';
import {
  parseFaqCategory,
  sortFaqCategories,
  toFirestoreQuestions,
} from '../utils/faq.mapper';

@Injectable({
  providedIn: 'root',
})
export class FaqsFirestoreService {
  private readonly firestore = inject(Firestore);

  async loadCategories(): Promise<FaqCategory[]> {
    const snapshot = await getDocs(collection(this.firestore, FAQS_COLLECTION));
    const categories = snapshot.docs.map((entry) =>
      parseFaqCategory(entry.id, entry.data() as Record<string, unknown>),
    );
    return sortFaqCategories(categories);
  }

  async saveCategoryQuestions(categoryId: string, questions: FaqEntry[]): Promise<void> {
    await updateDoc(doc(this.firestore, FAQS_COLLECTION, categoryId), {
      questions: toFirestoreQuestions(questions),
      updatedAt: new Date(),
    });
  }
}
