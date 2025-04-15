import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductFacade } from '../../product.facade';
import { RouterLink } from '@angular/router';

/**
 * Component for displaying a list of products.
 *
 * This standalone component fetches and displays a list of products,
 * using the ProductFacade for data access and OnPush change detection for performance.
 *
 * @example
 * <lib-product-list/>
 */
@Component({
  selector: 'lib-product-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'product-list',
    class: 'bg-white',
  },
})
export class ProductListComponent implements OnInit {
  readonly #productFacade = inject(ProductFacade);

  readonly products = this.#productFacade.getFiltered();

  /**
   * Fetches all products from the backend.
   */
  ngOnInit() {
    this.#productFacade.fetchAll();
  }
}
