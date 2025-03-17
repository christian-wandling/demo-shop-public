import { Route } from '@angular/router';
import { CheckoutComponent } from '@demo-shop/cart';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'orders',
    loadChildren: () => import('@demo-shop/order').then(m => m.orderRoutes),
  },
  {
    path: 'products',
    loadChildren: () => import('@demo-shop/product').then(m => m.productRoutes),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
