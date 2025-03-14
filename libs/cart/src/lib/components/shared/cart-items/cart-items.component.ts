import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartItemResponse } from '@demo-shop/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cart-items',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemsComponent {
  readonly items = input.required<CartItemResponse[]>();

  removeItem = output<number>();
}
