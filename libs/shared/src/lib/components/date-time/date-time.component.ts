import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-date-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeComponent {
  /**
   * Date to display
   */
  readonly dateTime: InputSignal<Date | string> = input.required<Date | string>();
  /**
   * Pattern used to format date
   */
  readonly pattern: InputSignal<string> = input<string>('MMM dd, YYYY');
  /**
   * Timezone used to display date
   */
  readonly timezone: InputSignal<string> = input<string>('UTC');
}
