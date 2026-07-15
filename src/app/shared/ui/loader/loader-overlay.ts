import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { AppLoader } from './loader';

@Component({
  selector: 'app-loader-overlay',
  imports: [AppLoader],
  templateUrl: './loader-overlay.html',
  styleUrl: './loader-overlay.css',
})
export class AppLoaderOverlay {
  private readonly loaderService = inject(LoaderService);

  readonly state = this.loaderService.state;
}
