import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartItemDTO } from '@demo-shop/api';

@Component({
  selector: 'lib-cart-items',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemsComponent {
  readonly items = input.required<CartItemDTO[]>();

  removeItem = output<string>();
}
