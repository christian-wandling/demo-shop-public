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
})
export class CheckoutComponent {
  /**
   * Constant for medium screen size breakpoint in pixels (786px).
   */
  readonly BREAKPOINT_MD = 786;

  readonly checkoutForm = this.createCheckOutForm();
  /** Signal indicating whether the update user button should be enabled */
  readonly updateButtonEnabled = this.getUpdateEnabled();
  /** Signal indicating whether the checkout button should be enabled */
  readonly checkoutButtonEnabled = this.getCheckoutEnabled();
  readonly #cartFacade = inject(CartFacade);
  readonly items = this.#cartFacade.getAll();
  readonly price = this.#cartFacade.getTotalPrice();
  readonly #userFacade = inject(UserFacade);
  readonly user = this.#userFacade.getCurrentUser();
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);

  /** Extend shipping information when above breakpoint */
  readonly shippingInformationExtended = signal(window.innerWidth >= this.BREAKPOINT_MD);

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

  /**
   * Creates and initializes the checkout form
   * Populates form with user data when available
   */
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

  /**
   * Determines whether the checkout button should be enabled
   * Checks if there are items in cart, user has address, and no pending form changes
   */
  getCheckoutEnabled(): Signal<boolean> {
    return computed(() => {
      const hasShoppingItems = this.items().length > 0;
      const hasUserAddress = !!this.user()?.address;
      const hasUserDataChanges = this.checkoutForm().dirty;

      return hasShoppingItems && hasUserAddress && !hasUserDataChanges;
    });
  }

  /**
   * Determines whether the update user button should be enabled
   * Checks if the form is valid and has been modified
   */
  getUpdateEnabled(): Signal<boolean> {
    return computed(() => this.checkoutForm().valid && this.checkoutForm().dirty);
  }
}
