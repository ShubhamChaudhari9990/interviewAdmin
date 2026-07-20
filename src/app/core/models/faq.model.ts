export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  questions: FaqEntry[];
}

export interface FaqEntryForm {
  question: string;
  answer: string;
}
