import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '@demo-shop/api';

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
  readonly status = input.required<OrderStatus>();
}
