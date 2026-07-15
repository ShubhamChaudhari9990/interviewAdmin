import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { INTERVIEW_DOMAIN_COLLECTION } from '../constants/firestore-collections';
import type { CareerPathData } from '../models/career-path.model';
import type { InterviewType, InterviewTypeData } from '../models/interview-type.model';
import type { FirestoreInterviewDomain } from '../models/interview-domain-firestore.model';
import {
  fromCareerPathData,
  parseFirestoreInterviewDomains,
  toCareerPathData,
} from '../utils/career-path.mapper';
import {
  applyInterviewTypesToDomains,
  toInterviewTypeData,
} from '../utils/interview-type.mapper';

@Injectable({
  providedIn: 'root',
})
export class InterviewDomainFirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly documentId = INTERVIEW_DOMAIN_COLLECTION;

  async loadCareerPathData(): Promise<CareerPathData> {
    const snapshot = await getDoc(
      doc(this.firestore, INTERVIEW_DOMAIN_COLLECTION, this.documentId),
    );

    if (!snapshot.exists()) {
      return {
        domains: [],
        categories: [],
        specializations: [],
        targetRoles: [],
      };
    }

    const payload = snapshot.data();
    const firestoreDomains = parseFirestoreInterviewDomains(payload);
    return toCareerPathData(firestoreDomains, payload['updatedAt']);
  }

  async saveCareerPathData(data: CareerPathData): Promise<void> {
    const existing = await this.loadFirestoreDomains();
    const domains = fromCareerPathData(data, existing);

    await this.saveFirestoreDomains(domains);
  }

  async loadInterviewTypeData(): Promise<InterviewTypeData> {
    const snapshot = await getDoc(
      doc(this.firestore, INTERVIEW_DOMAIN_COLLECTION, this.documentId),
    );

    if (!snapshot.exists()) {
      return { careerDomains: [], interviewTypes: [] };
    }

    const payload = snapshot.data();
    const firestoreDomains = parseFirestoreInterviewDomains(payload);
    return toInterviewTypeData(firestoreDomains, payload['updatedAt']);
  }

  async saveInterviewTypeData(interviewTypes: InterviewTypeData['interviewTypes']): Promise<void> {
    const existing = await this.loadFirestoreDomains();
    const domains = applyInterviewTypesToDomains(existing, interviewTypes);
    await this.saveFirestoreDomains(domains);
  }

  async loadMasterData(): Promise<{ careerPath: CareerPathData; interviewTypes: InterviewType[] }> {
    const snapshot = await getDoc(
      doc(this.firestore, INTERVIEW_DOMAIN_COLLECTION, this.documentId),
    );

    if (!snapshot.exists()) {
      return {
        careerPath: {
          domains: [],
          categories: [],
          specializations: [],
          targetRoles: [],
        },
        interviewTypes: [],
      };
    }

    const payload = snapshot.data();
    const firestoreDomains = parseFirestoreInterviewDomains(payload);
    const updatedAt = payload['updatedAt'];

    return {
      careerPath: toCareerPathData(firestoreDomains, updatedAt),
      interviewTypes: toInterviewTypeData(firestoreDomains, updatedAt).interviewTypes,
    };
  }

  async saveMasterData(careerPath: CareerPathData, interviewTypes: InterviewType[]): Promise<void> {
    const existing = await this.loadFirestoreDomains();
    const domains = applyInterviewTypesToDomains(
      fromCareerPathData(careerPath, existing),
      interviewTypes,
    );
    await this.saveFirestoreDomains(domains);
  }

  private async saveFirestoreDomains(domains: FirestoreInterviewDomain[]): Promise<void> {
    await setDoc(
      doc(this.firestore, INTERVIEW_DOMAIN_COLLECTION, this.documentId),
      {
        domains,
        updatedAt: new Date(),
      },
      { merge: true },
    );
  }

  private async loadFirestoreDomains(): Promise<FirestoreInterviewDomain[]> {
    const snapshot = await getDoc(
      doc(this.firestore, INTERVIEW_DOMAIN_COLLECTION, this.documentId),
    );

    if (!snapshot.exists()) {
      return [];
    }

    return parseFirestoreInterviewDomains(snapshot.data());
  }
}
