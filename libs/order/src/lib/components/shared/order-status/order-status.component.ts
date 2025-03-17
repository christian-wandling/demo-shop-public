import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '@demo-shop/api';

/**
 * Component for displaying the status of an order.
 *
 * This standalone component displays the order status using different background colors
 * based on the status value. It renders the status text in a styled container with
 * conditional formatting:
 * - Green background for "Completed" status
 * - Orange background for "Created" status
 *
 * The component uses OnPush change detection for improved performance and is designed
 * to be used within order-related views.
 *
 * @example
 * <lib-order-status [status]="order.status"></lib-order-status>
 */
@Component({
  selector: 'lib-order-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'rounded-lg px-4 py-1.5 max-w-28 text-center text-white border border-slate-300 text-xs',
    '[class.bg-green-800]': 'this.status() === "Completed"',
    '[class.bg-orange-500]': 'this.status() === "Created"',
  },
})
export class OrderStatusComponent {
  /**
   * Required input property representing the order status.
   * This signal input determines both the displayed text and styling of the component.
   *
   * @required
   */
  readonly status = input.required<OrderStatus>();
}
