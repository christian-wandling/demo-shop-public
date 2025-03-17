import { FormControl, FormGroup } from '@angular/forms';

/**
 * Interface representing the structure of a checkout form.
 * Contains form controls for personal information and a nested form group for address details.
 */
export interface CheckoutForm {
  /** Form control for the customer's first name */
  firstname: FormControl<string>;

  /** Form control for the customer's last name */
  lastname: FormControl<string>;

  /** Form control for the customer's email address */
  email: FormControl<string>;

  /** Optional form control for the customer's phone number */
  phone?: FormControl<string | null>;

  /** Nested form group containing address information */
  address: FormGroup<CheckoutAddressForm>;
}

/**
 * Interface representing the structure of an address form within the checkout process.
 * Contains form controls for various components of a physical address.
 */
export interface CheckoutAddressForm {
  /** Form control for the customer's country */
  country: FormControl<string>;

  /** Form control for the customer's street address */
  street: FormControl<string>;

  /** Form control for apartment, suite, or unit number */
  apartment: FormControl<string>;

  /** Form control for the customer's city */
  city: FormControl<string>;

  /** Form control for state/province/region (optional) */
  region: FormControl<string | null>;

  /** Form control for postal/ZIP code */
  zip: FormControl<string>;
}
