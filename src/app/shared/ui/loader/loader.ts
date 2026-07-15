import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class AppLoader {
  @Input() label = 'Loading...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showLabel = true;
}
