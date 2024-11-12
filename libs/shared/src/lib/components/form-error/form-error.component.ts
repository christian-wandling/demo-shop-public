import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'lib-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'text-xs text-red-600',
  },
})
export class FormErrorComponent {
  readonly fieldName = input<string>('Field');
  readonly errors = input.required<ValidationErrors | null>();
}
