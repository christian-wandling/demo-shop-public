import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartFacade } from '../../cart.facade';

@Component({
  selector: 'lib-cart-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartIconComponent {
  readonly #cartFacade = inject(CartFacade);
  readonly itemsInCart = this.#cartFacade.getItemCount();

  showCart(): void {
    this.#cartFacade.setShowCart(true);
  }
}
