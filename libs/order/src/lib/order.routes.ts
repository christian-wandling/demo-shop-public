import { Route } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { permissionGuard } from '@demo-shop/auth';

export const orderRoutes: Route[] = [
  { path: '', component: OrderListComponent, canActivate: [permissionGuard] },
  { path: ':id', component: OrderDetailComponent, canActivate: [permissionGuard] },
];
