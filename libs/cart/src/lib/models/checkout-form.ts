import { FormControl, FormGroup } from '@angular/forms';

export interface CheckoutForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormGroup<CheckoutAddressForm>;
}

export interface CheckoutAddressForm {
  country: FormControl<string>;
  street: FormControl<string>;
  apartment: FormControl<string>;
  city: FormControl<string>;
  region: FormControl<string | null>;
  zip: FormControl<string>;
}
