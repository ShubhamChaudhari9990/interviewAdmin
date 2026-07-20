import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { PLANS_COLLECTION } from '../constants/firestore-collections';
import type { SubscriptionPlan, SubscriptionPlanForm } from '../models/subscription-plan.model';
import {
  formToPlanPatch,
  parseSubscriptionPlan,
  sortSubscriptionPlans,
} from '../utils/subscription-plan.mapper';

@Injectable({
  providedIn: 'root',
})
export class PlansFirestoreService {
  private readonly firestore = inject(Firestore);

  async loadPlans(): Promise<SubscriptionPlan[]> {
    const snapshot = await getDocs(collection(this.firestore, PLANS_COLLECTION));
    const plans = snapshot.docs.map((entry) =>
      parseSubscriptionPlan(entry.id, entry.data() as Record<string, unknown>),
    );
    return sortSubscriptionPlans(plans);
  }

  async updatePlan(planId: string, form: SubscriptionPlanForm): Promise<void> {
    const payload = formToPlanPatch(form);
    await updateDoc(doc(this.firestore, PLANS_COLLECTION, planId), {
      ...payload,
      id: planId,
      updatedAt: new Date(),
    });
  }
}
