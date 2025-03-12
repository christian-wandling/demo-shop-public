import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductFacade } from '../../product.facade';
import { ActivatedRoute } from '@angular/router';
import { CartFacade } from '@demo-shop/cart';

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

  ngOnInit() {
    this.#productFacade.fetchById(this.#activatedRoute.snapshot.params['id']);
  }

  addToCart(id: number): void {
    this.#cartFacade.addItem(id);
  }
}
