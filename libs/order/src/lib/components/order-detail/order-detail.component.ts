import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderFacade } from '../../order.facade';
import { ActivatedRoute } from '@angular/router';
import { UserFacade } from '@demo-shop/user';
import { PrintInvoiceService } from '../../services/print-invoice.service';
import { OrderResponse, UserResponse } from '@demo-shop/api';
import { OrderStatusComponent } from '../shared/order-status/order-status.component';
import { DateTimeComponent } from '@demo-shop/shared';

@Component({
  selector: 'lib-order-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, OrderStatusComponent, DateTimeComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #orderFacade = inject(OrderFacade);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly order = this.#orderFacade.find(this.#activatedRoute.snapshot.params['id']);
  readonly #printInvoiceService = inject(PrintInvoiceService);

  ngOnInit(): void {
    this.#orderFacade.fetchById(this.#activatedRoute.snapshot.params['id']);
  }

  printPdf(order: OrderResponse, user: UserResponse | undefined): void {
    if (!user) {
      console.error('Could not find user');
      return;
    }

    this.#printInvoiceService.generatePdf(order, user);
  }
}
