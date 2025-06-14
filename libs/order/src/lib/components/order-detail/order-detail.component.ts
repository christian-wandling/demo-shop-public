import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderFacade } from '../../order.facade';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserFacade } from '@demo-shop/user';
import { PrintInvoiceService } from '../../services/print-invoice.service';
import { OrderResponse, UserResponse } from '@demo-shop/api';
import { OrderStatusComponent } from '../shared/order-status/order-status.component';
import { DateTimeComponent } from '@demo-shop/shared';

/**
 * Component that displays detailed information about a specific order.
 * Fetches order data based on the ID from the route parameters.
 *
 * @example
 * <lib-order-detail/>
 */
@Component({
  selector: 'lib-order-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, OrderStatusComponent, DateTimeComponent, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block mx-auto mb-8 px-8 max-w-5xl',
    'data-testid': 'order-detail',
  },
})
export class OrderDetailComponent implements OnInit {
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #orderFacade = inject(OrderFacade);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly order = this.#orderFacade.getById(this.#activatedRoute.snapshot.params['id']);
  readonly #printInvoiceService = inject(PrintInvoiceService);

  /**
   * Fetches the specific order data using the ID from route parameters
   */
  ngOnInit(): void {
    this.#orderFacade.fetchById(this.#activatedRoute.snapshot.params['id']);
  }

  /**
   * Generates and prints a PDF invoice for the specified order
   *
   * @param order - The order data used to generate the invoice
   * @param user - The user data needed for billing information
   */
  printPdf(order: OrderResponse, user: UserResponse | undefined): void {
    if (!user) {
      console.error('Could not find user');
      return;
    }

    this.#printInvoiceService.generatePdf(order, user);
  }
}
