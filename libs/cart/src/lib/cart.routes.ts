import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const cartRoutes: Routes = [
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
];
