import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartItemResponse } from '@demo-shop/api';
import { RouterLink } from '@angular/router';

/**
 * CartItemsComponent displays items in a shopping cart.
 *
 * This component is designed to render cart items and provide functionality
 * to interact with them, such as removing items from the cart.
 *
 * @example
 * <lib-cart-items [items]="cartItems" (removeItem)="handleRemoveItem($event)"/>
 */
@Component({
  selector: 'lib-cart-items',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemsComponent {
  /**
   * The list of items in the cart to be displayed.
   *
   * @required
   */
  readonly items: InputSignal<CartItemResponse[]> = input.required<CartItemResponse[]>();

  /**
   * Event emitted when a user requests to remove an item from the cart.
   * The emitted value is the ID of the item to be removed.
   */
  readonly removeItem: OutputEmitterRef<number> = output<number>();

  /**
   * Event emitted when a user clicks on a thumbnail.
   */
  readonly thumbnailClicked: OutputEmitterRef<void> = output();
}
