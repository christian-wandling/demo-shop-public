import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
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
    class: 'text-xs text-red-600',
  },
})
export class FormErrorComponent {
  /**
   * Name of form field
   */
  readonly fieldName: InputSignal<string> = input<string>('Field');
  /**
   * Set of validation errors
   */
  readonly errors: InputSignal<ValidationErrors | null> = input.required<ValidationErrors | null>();
}
