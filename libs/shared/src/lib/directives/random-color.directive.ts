import { Directive, HostBinding, inject } from '@angular/core';
import { RandomIntService } from '../services/random-int.service';

export const COLORS: string[] = [
  '#f3a05c',
  '#e8b143',
  '#fde183',
  '#8ca7c1',
  '#4c7aae',
  '#0e73bb',
  '#ace7f6',
  '#eeedf0',
  '#d3e2ca',
  '#8dbca1',
  '#91c37b',
  '#c498c8',
  '#796593',
  '#ff8c8c',
  '#c16376',
];

@Directive({
  selector: '[libRandomColor]',
  standalone: true,
})
export class RandomColorDirective {
  readonly randomIntService = inject(RandomIntService);

  @HostBinding('style.background') backgroundColor: string = this.getColor();

  getColor(): string {
    return COLORS[this.randomIntService.getValue(COLORS.length)];
  }
}
