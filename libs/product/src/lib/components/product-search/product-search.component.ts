import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductFacade } from '../../product.facade';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-product-search',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex align-middle lg:ml-6 cursor-pointer relative',
  },
})
export class ProductSearchComponent {
  readonly #productFacade = inject(ProductFacade);
  readonly productFilter = this.#productFacade.getFilter();
  readonly #router = inject(Router);

  setProductNameFilter(name?: string): void {
    this.#productFacade.setFilter({
      name,
    });
  }

  goToProductPage(): void {
    this.#router.navigateByUrl('/products');
  }
}
