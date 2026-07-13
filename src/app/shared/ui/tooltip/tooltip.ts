import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipEvent = 'hover' | 'focus' | 'both';

@Component({
  selector: 'app-tooltip',
  imports: [Tooltip],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppTooltip {
  @Input({ required: true }) text = '';
  @Input() position: TooltipPosition = 'top';
  @Input() event: TooltipEvent = 'hover';
  @Input() showDelay = 200;
  @Input() hideDelay = 0;
  @Input() disabled = false;
  @Input() escape = true;
  @Input() fitContent = true;
  @Input() hideOnEscape = true;
  @Input() inline = true;
}
