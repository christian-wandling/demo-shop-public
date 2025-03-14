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
    data: { pageTitle: 'Checkout', showInMenu: false },
  },
  {
    path: 'orders',
    loadChildren: () => import('@demo-shop/order').then(m => m.orderRoutes),
    data: { pageTitle: 'Orders', showInMenu: true },
  },
  {
    path: 'products',
    loadChildren: () => import('@demo-shop/product').then(m => m.productRoutes),
    data: { pageTitle: 'Products', showInMenu: true },
  },
];
