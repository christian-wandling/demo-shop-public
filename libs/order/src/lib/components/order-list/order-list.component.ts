import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderFacade } from '../../order.facade';
import { UserFacade } from '@demo-shop/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {
  readonly MAX_THUMBNAILS = 5;

  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #orderFacade = inject(OrderFacade);
  readonly orders = this.#orderFacade.getSortedByStatusAndDate();
}
