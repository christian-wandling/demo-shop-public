import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartFacade } from '../../cart.facade';
import { RouterLink } from '@angular/router';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { animateBackdrop, animateSlideOver } from './cart.animations';

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
  readonly checkoutButtonEnabled = computed(() => this.items().length > 0);
  readonly totalPrice = this.#cartFacade.getTotalPrice();
  readonly showCart = this.#cartFacade.getShowCart();

  removeItem(id: number): void {
    this.#cartFacade.removeItem(id);
  }

  closeCart(): void {
    this.#cartFacade.setShowCart(false);
  }
}
