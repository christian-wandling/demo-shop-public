import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartFacade } from '../../cart.facade';
import { FormErrorComponent } from '@demo-shop/shared';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutAddressForm, CheckoutForm } from '../../models/checkout-form';
import { UserFacade } from '@demo-shop/user';
import { Router } from '@angular/router';
import { UpdateUserAddressRequest } from '@demo-shop/api';

@Component({
  selector: 'lib-checkout',
  standalone: true,
  imports: [CommonModule, CartItemsComponent, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  readonly checkoutForm = this.createCheckOutForm();
  readonly isUpdateEnabled = this.getUpdateEnabled();
  readonly isCheckoutEnabled = this.getCheckoutEnabled();
  readonly #cartFacade = inject(CartFacade);
  readonly items = this.#cartFacade.getAll();
  readonly price = this.#cartFacade.getTotalPrice();
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly showShippingInformation = signal(window.innerWidth >= 768);

  removeItem(id: number): void {
    this.#cartFacade.removeItem(id);
  }

  async checkout(): Promise<void> {
    try {
      await this.#cartFacade.checkout();
      this.#router.navigateByUrl('/products');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateUser(): Promise<void> {
    const { address, phone } = this.checkoutForm().controls;
    if (address.dirty && address.valid) {
      await this.#userFacade.updateUserAddress(address.value as UpdateUserAddressRequest);
    }

    if (phone?.dirty) {
      await this.#userFacade.updateUserPhone({ phone: phone.value });
    }
  }

  createCheckOutForm(): Signal<FormGroup<CheckoutForm>> {
    return computed(() =>
      this.#fb.group<CheckoutForm>({
        firstname: this.#fb.control(
          {
            value: this.user()?.firstname ?? '',
            disabled: true,
          },
          { validators: Validators.required, nonNullable: true }
        ),
        lastname: this.#fb.control(
          {
            value: this.user()?.lastname ?? '',
            disabled: true,
          },
          { validators: Validators.required, nonNullable: true }
        ),
        email: this.#fb.control(
          { value: this.user()?.email ?? '', disabled: true },
          {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
          }
        ),
        phone: this.#fb.control(this.user()?.phone ?? ''),
        address: this.#fb.group<CheckoutAddressForm>(
          {
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
            zip: this.#fb.control(this.user()?.address?.zip ?? '', {
              validators: Validators.required,
              nonNullable: true,
            }),
          },
          { validators: Validators.required }
        ),
      })
    );
  }

  getCheckoutEnabled(): Signal<boolean> {
    return computed(() => {
      const hasShoppingItems = this.items().length > 0;
      const hasUserAddress = !!this.user()?.address;
      const hasUserDataChanges = this.checkoutForm().dirty;

      return hasShoppingItems && hasUserAddress && !hasUserDataChanges;
    });
  }

  getUpdateEnabled(): Signal<boolean> {
    return computed(() => this.checkoutForm().valid && this.checkoutForm().dirty);
  }
}
