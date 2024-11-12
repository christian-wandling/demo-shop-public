import { ProductListComponent } from './components/product-list/product-list.component';
import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const productRoutes: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: ':id',
    component: ProductDetailComponent,
    data: { pageTitle: 'Product details' },
  },
];
