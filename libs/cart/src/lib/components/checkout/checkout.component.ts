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

/**
 * Checkout component responsible for handling the user checkout flow.
 * Manages the checkout form, user data update, and cart checkout process.
 *
 * @example
 * <lib-checkout/>
 */
@Component({
  selector: 'lib-checkout',
  standalone: true,
  imports: [CommonModule, CartItemsComponent, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'checkout-container',
  },
})
export class CheckoutComponent {
  /**
   * Constant for medium screen size breakpoint in pixels (768px).
   */
  readonly BREAKPOINT_MD = 768;
  readonly checkoutForm = this.createCheckOutForm();
  readonly shippingInformationExtended = signal(window.innerWidth >= this.BREAKPOINT_MD);
  readonly #cartFacade = inject(CartFacade);
  readonly items = this.#cartFacade.getAll();
  readonly price = this.#cartFacade.getTotalPrice();
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);

  get formDirty(): Signal<boolean> {
    return computed(() => this.checkoutForm().dirty);
  }

  get formValid(): Signal<boolean> {
    return computed(() => this.checkoutForm().valid);
  }

  get updateButtonEnabled(): Signal<boolean> {
    return computed(() => this.formValid() && this.formDirty());
  }

  get checkoutButtonEnabled(): Signal<boolean> {
    return computed(() => {
      const hasShoppingItems = this.items().length > 0;
      const hasUserAddress = !!this.user()?.address;
      const hasUserDataChanges = this.formDirty();

      return hasShoppingItems && hasUserAddress && !hasUserDataChanges;
    });
  }

  /**
   * Creates and initializes the checkout form
   * Populates form with user data when available
   */
  createCheckOutForm(): Signal<FormGroup<CheckoutForm>> {
    return computed(() => {
      const fb = this.#fb;
      const user = this.user();

      return fb.group<CheckoutForm>({
        firstname: fb.control(
          {
            value: user?.firstname ?? '',
            disabled: true,
          },
          { validators: Validators.required, nonNullable: true }
        ),
        lastname: fb.control(
          {
            value: user?.lastname ?? '',
            disabled: true,
          },
          { validators: Validators.required, nonNullable: true }
        ),
        email: fb.control(
          { value: user?.email ?? '', disabled: true },
          {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
          }
        ),
        phone: fb.control(user?.phone ?? ''),
        address: fb.group<CheckoutAddressForm>(
          {
            country: fb.control(user?.address?.country ?? '', {
              validators: Validators.required,
              nonNullable: true,
            }),
            street: fb.control(user?.address?.street ?? '', {
              validators: Validators.required,
              nonNullable: true,
            }),
            apartment: fb.control(user?.address?.apartment ?? '', {
              validators: Validators.required,
              nonNullable: true,
            }),
            city: fb.control(user?.address?.city ?? '', {
              validators: Validators.required,
              nonNullable: true,
            }),
            region: fb.control(user?.address?.region ?? ''),
            zip: fb.control(user?.address?.zip ?? '', {
              validators: Validators.required,
              nonNullable: true,
            }),
          },
          { validators: Validators.required }
        ),
      });
    });
  }

  /**
   * Removes an item from the cart
   * @param id - The ID of the item to remove
   */
  removeItem(id: number): void {
    this.#cartFacade.removeItem(id);
  }

  /**
   * Processes the checkout operation
   * Calls the cart facade to complete the checkout and navigates to the products page
   * @throws Error if checkout fails
   */
  async checkout(): Promise<void> {
    try {
      await this.#cartFacade.checkout();
      this.#router.navigateByUrl('/products');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  /**
   * Updates the user's information if the form has been modified
   * Updates address and phone number if they have been changed
   */
  async updateUser(): Promise<void> {
    const { address, phone } = this.checkoutForm().controls;
    if (address.dirty && address.valid) {
      await this.#userFacade.updateUserAddress(address.value as UpdateUserAddressRequest);
    }

    if (phone?.dirty) {
      await this.#userFacade.updateUserPhone({ phone: phone.value });
    }
  }
}
