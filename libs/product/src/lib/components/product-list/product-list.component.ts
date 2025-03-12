import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductFacade } from '../../product.facade';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-product-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-white',
  },
})
export class ProductListComponent implements OnInit {
  readonly #productFacade = inject(ProductFacade);

  readonly products = this.#productFacade.getFiltered();

  ngOnInit() {
    this.#productFacade.fetchAll();
  }
}
