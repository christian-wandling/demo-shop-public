import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartFacade } from '../../cart.facade';
import { RouterLink } from '@angular/router';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { animateBackdrop, animateSlideOver } from './cart.animations';

/**
 * Component that displays the shopping cart with animation effects.
 * Shows cart items, total price, and provides checkout functionality.
 *
 * @example
 * <lib-cart/>
 */
@Component({
  selector: 'lib-cart',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, CartItemsComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animateBackdrop, animateSlideOver],
})
export class CartComponent {
  readonly #cartFacade = inject(CartFacade);
  readonly items = this.#cartFacade.getAll();
  /**
   * Computed signal that determines if the checkout button should be enabled
   * Button is enabled only when there are items in the cart
   */
  readonly checkoutButtonEnabled = computed(() => this.items().length > 0);
  readonly totalPrice = this.#cartFacade.getTotalPrice();
  readonly showCart = this.#cartFacade.getShowCart();

  /**
   * Removes an item from the cart
   *
   * @param id - The unique identifier of the item to remove
   */
  removeItem(id: number): void {
    this.#cartFacade.removeItem(id);
  }

  /**
   * Closes the cart slide-over panel
   * Updates the showCart state to hide the cart UI
   */
  closeCart(): void {
    this.#cartFacade.setShowCart(false);
  }
}
