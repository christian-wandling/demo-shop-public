import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartFacade } from '../../cart.facade';
import { FormErrorComponent } from '@demo-shop/shared';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutAddressForm, CheckoutForm } from '../../models/checkout-form';
import { UserFacade } from '@demo-shop/user';
import { OrderFacade } from '@demo-shop/order';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-checkout',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CartItemsComponent, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  readonly #cartFacade = inject(CartFacade);
  readonly items = this.#cartFacade.getAll();
  readonly price = this.#cartFacade.getTotalPrice();
  readonly #orderFacade = inject(OrderFacade);
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #fb = inject(FormBuilder);
  readonly checkoutForm = computed(() =>
    this.#fb.group<CheckoutForm>({
      firstname: this.#fb.control(this.user()?.firstname ?? '', { validators: Validators.required, nonNullable: true }),
      lastname: this.#fb.control(this.user()?.lastname ?? '', { validators: Validators.required, nonNullable: true }),
      email: this.#fb.control(this.user()?.email ?? '', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      phone: this.#fb.control(this.user()?.phone ?? '', { validators: Validators.required, nonNullable: true }),
      address: this.#fb.group<CheckoutAddressForm>({
        country: this.#fb.control(this.user()?.address?.country ?? '', {
          validators: Validators.required,
          nonNullable: true,
        }),
        street: this.#fb.control(this.user()?.address?.street ?? '', {
          validators: Validators.required,
          nonNullable: true,
        }),
        apartment: this.#fb.control(this.user()?.address?.apartment ?? '', {
          validators: Validators.required,
          nonNullable: true,
        }),
        city: this.#fb.control(this.user()?.address?.city ?? '', {
          validators: Validators.required,
          nonNullable: true,
        }),
        region: this.#fb.control(this.user()?.address?.region ?? ''),
        zip: this.#fb.control(this.user()?.address?.zip ?? '', { validators: Validators.required, nonNullable: true }),
      }),
    })
  );

  readonly #router = inject(Router);

  removeItem(id: number): void {
    this.#cartFacade.removeItem(id);
  }

  async createOrder(): Promise<void> {
    try {
      await this.#orderFacade.createOrder();

      await this.#cartFacade.loadShoppingSession();

      this.#router.navigateByUrl('/products');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
