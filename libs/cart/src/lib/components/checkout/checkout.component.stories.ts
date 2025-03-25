import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AddressResponse, CartItemResponse, UserResponse } from '@demo-shop/api';
import { faker } from '@faker-js/faker';
import { FormErrorComponent, provideImageLoader } from '@demo-shop/shared';
import { CartFacade } from '../../cart.facade';
import { CheckoutComponent } from '../../cart.routes';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFacade } from '@demo-shop/user';

const items: CartItemResponse[] = Array.from({ length: 5 }).map((_, id) => {
  const quantity = faker.number.int({ min: 1, max: 5 });
  const unitPrice = faker.number.int({ min: 1, max: 20 }) * 10 - 1;

  return {
    id,
    productId: faker.number.int({ min: 1, max: 20 }),
    productName: faker.commerce.productName(),
    productThumbnail: faker.image.urlPicsumPhotos(),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
  };
});

const address: AddressResponse = {
  street: faker.location.streetAddress(),
  apartment: faker.number.int({ max: 100 }).toString(),
  city: faker.location.city(),
  zip: faker.location.zipCode('#####'),
  region: faker.location.state(),
  country: 'United States',
};

const user: UserResponse = {
  id: 1,
  email: faker.internet.email(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  phone: faker.helpers.fromRegExp('+[0-9]{9}'),
};

const mockCartFacade = (items: CartItemResponse[]) => ({
  removeItem: () => {
    return;
  },
  checkout: () => {
    return;
  },
  getAll: () => signal(items),
  getTotalPrice: () => {
    const totalPrice = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
    return signal(totalPrice);
  },
  getShowCart: () => signal(true),
  setShowCart: () => {
    return;
  },
});

const mockUserFacade = (user: UserResponse) => ({
  updateUserAddress: () => {
    return;
  },
  updateUserPhone: () => {
    return;
  },
  getCurrentUser: () => signal(user),
});

const meta: Meta<CheckoutComponent> = {
  component: CheckoutComponent,
  title: 'Cart/CheckoutComponent',
  decorators: [
    applicationConfig({
      providers: [provideImageLoader(), provideRouter([]), { provide: CartFacade, useValue: mockCartFacade(items) }],
    }),
    moduleMetadata({
      imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, CartItemsComponent, FormErrorComponent],
    }),
  ],
  argTypes: {
    removeItem: { action: 'removeItem', control: false },
    checkout: { action: 'checkout', control: false },
    updateUser: { action: 'updateUser', control: false },
  },
  parameters: {
    controls: {
      exclude: [
        'checkoutForm',
        'shippingInformationExtended',
        '#cartFacade',
        'items',
        'price',
        '#userFacade',
        'user',
        '#fb',
        '#router',
        'formDirty',
        'formValid',
        'updateButtonEnabled',
        'checkoutButtonEnabled',
        'createCheckOutForm',
      ],
    },
  },
};
export default meta;
type Story = StoryObj<CheckoutComponent>;

export const WithValidShippingInformation: Story = {
  decorators: [
    applicationConfig({
      providers: [{ provide: UserFacade, useValue: mockUserFacade({ ...user, address }) }],
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const firstname: HTMLInputElement = canvas.getByRole('textbox', { name: /first name/i });
    const lastname: HTMLInputElement = canvas.getByRole('textbox', { name: /last name/i });
    const email: HTMLInputElement = canvas.getByRole('textbox', { name: /email/i });
    const phone: HTMLInputElement = canvas.getByRole('textbox', { name: /phone/i });
    const country: HTMLInputElement = canvas.getByRole('combobox', { name: /country/i });
    const street: HTMLInputElement = canvas.getByRole('textbox', { name: /street/i });
    const apartment: HTMLInputElement = canvas.getByRole('textbox', { name: /apartment/i });
    const city: HTMLInputElement = canvas.getByRole('textbox', { name: /city/i });
    const region: HTMLInputElement = canvas.getByRole('textbox', { name: /state/i });
    const zip: HTMLInputElement = canvas.getByRole('textbox', { name: /zip/i });
    const buttonCheckout: HTMLButtonElement = canvas.getByText('Checkout');
    expect(firstname.value).toBe(user.firstname);
    expect(lastname.value).toBe(user.lastname);
    expect(email.value).toBe(user.email);
    expect(phone.value).toBe(user.phone);
    expect(country.value).toBe(address.country);
    expect(street.value).toBe(address.street);
    expect(apartment.value).toBe(address.apartment);
    expect(city.value).toBe(address.city);
    expect(region.value).toBe(address.region);
    expect(zip.value).toBe(address.zip);
    expect(buttonCheckout).not.toBeDisabled();
  },
};

export const WithoutValidShippingInformation: Story = {
  decorators: [
    applicationConfig({
      providers: [{ provide: UserFacade, useValue: mockUserFacade(user) }],
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buttonCheckout: HTMLButtonElement = canvas.getByText('Checkout');
    expect(buttonCheckout).toBeDisabled();
  },
};
