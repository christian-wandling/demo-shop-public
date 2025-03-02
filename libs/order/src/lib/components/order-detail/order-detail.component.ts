import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderFacade } from '../../order.facade';
import { ActivatedRoute } from '@angular/router';
import { UserFacade } from '@demo-shop/user';
import { PrintInvoiceService } from '../../services/print-invoice.service';
import { OrderResponse, UserResponse } from '@demo-shop/api';

@Component({
  selector: 'lib-order-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #orderFacade = inject(OrderFacade);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly order = this.#orderFacade.find(this.#activatedRoute.snapshot.params['id']);
  readonly #printInvoiceService = inject(PrintInvoiceService);

  printPdf(order: OrderResponse, user: UserResponse | undefined): void {
    if (!user) {
      console.error('Could not find user');
      return;
    }

    this.#printInvoiceService.generatePdf(order, user);
  }
}
