import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  readonly dateTime = input.required<Date | string>();
}
