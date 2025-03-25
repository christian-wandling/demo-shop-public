import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductFacade } from '../../product.facade';
import { ActivatedRoute } from '@angular/router';
import { CartFacade } from '@demo-shop/cart';

/**
 * Component for displaying details of a single product.
 *
 * This component fetches product data based on the route parameter 'id',
 * displays product details, and allows users to add the product to their cart.
 *
 * @example
 * <lib-product-detail/>
 */
@Component({
  selector: 'lib-product-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-white',
  },
})
export class ProductDetailComponent implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #productFacade = inject(ProductFacade);
  readonly product = this.#productFacade.getById(this.#activatedRoute.snapshot.params['id']);
  readonly #cartFacade = inject(CartFacade);
  readonly addButtonEnabled = this.#cartFacade.getHasShoppingSession();

  /**
   * Fetches the product data using the ID from the route parameters.
   */
  ngOnInit() {
    this.#productFacade.fetchById(this.#activatedRoute.snapshot.params['id']);
  }

  /**
   * Adds a product to the cart
   * @param id - The ID of the product to add
   */
  addToCart(id: number): void {
    this.#cartFacade.addItem(id);
  }
}
