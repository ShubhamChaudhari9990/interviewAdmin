import { Injectable, signal } from '@angular/core';
import type { LoaderState } from '../models/loader.model';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private depth = 0;

  readonly state = signal<LoaderState>({
    visible: false,
    message: 'Loading...',
  });

  show(message = 'Loading...'): void {
    this.depth += 1;
    this.state.set({ visible: true, message });
  }

  hide(): void {
    this.depth = Math.max(0, this.depth - 1);

    if (this.depth === 0) {
      this.state.set({ visible: false, message: 'Loading...' });
    }
  }

  async run<T>(task: () => Promise<T>, message = 'Loading...'): Promise<T> {
    this.show(message);

    try {
      return await task();
    } finally {
      this.hide();
    }
  }
}
