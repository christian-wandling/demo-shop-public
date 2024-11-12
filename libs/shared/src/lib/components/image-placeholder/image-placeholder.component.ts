import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomColorDirective } from '../../directives/random-color.directive';

@Component({
  selector: 'lib-image-placeholder',
  standalone: true,
  imports: [CommonModule, RandomColorDirective],
  templateUrl: './image-placeholder.component.html',
  styleUrl: './image-placeholder.component.scss',
  hostDirectives: [RandomColorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePlaceholderComponent {
  @Input({ required: true }) text!: string;
}
