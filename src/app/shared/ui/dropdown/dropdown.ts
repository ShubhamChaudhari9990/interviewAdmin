import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DropdownOption } from '../../../core/models/dropdown-option.model';

@Component({
  selector: 'app-dropdown',
  imports: [Select, FormsModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppDropdown implements OnDestroy {
  @ViewChild(Select) private select?: Select;

  @Input() options: DropdownOption[] = [];
  @Input() value = '';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() width = '9.5rem';
  @Input() ariaLabel?: string;

  @Output() valueChange = new EventEmitter<string>();

  onValueChange(next: string): void {
    this.value = next;
    this.valueChange.emit(next);
  }

  /** Close body-appended panel so it does not linger after modal teardown. */
  hide(): void {
    this.select?.hide();
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
