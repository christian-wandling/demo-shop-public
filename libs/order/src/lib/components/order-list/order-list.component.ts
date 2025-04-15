import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderFacade } from '../../order.facade';
import { UserFacade } from '@demo-shop/user';
import { RouterLink } from '@angular/router';
import { OrderStatusComponent } from '../shared/order-status/order-status.component';
import { DateTimeComponent } from '@demo-shop/shared';

/**
 * Component that displays a list of orders for the current user.
 * The orders are sorted by status and date.
 *
 * @example
 * <lib-order-list/>
 */
@Component({
  selector: 'lib-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, OrderStatusComponent, DateTimeComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'order-list',
  },
})
export class OrderListComponent implements OnInit {
  /**
   * Maximum number of product thumbnails to display per order
   */
  readonly MAX_THUMBNAILS = 5;

  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #orderFacade = inject(OrderFacade);
  readonly orders = this.#orderFacade.getSortedByStatusAndDate();

  /**
   * Fetches all orders for the current user
   */
  ngOnInit() {
    this.#orderFacade.fetchAll();
  }
}
