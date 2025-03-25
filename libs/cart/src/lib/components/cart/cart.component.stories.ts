import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { CartItemResponse } from '@demo-shop/api';
import { faker } from '@faker-js/faker';
import { provideImageLoader } from '@demo-shop/shared';
import { CartComponent } from './cart.component';
import { CartFacade } from '../../cart.facade';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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

const mockCartFacade = (items: CartItemResponse[]) => ({
  removeItem: () => {
    return;
  },
  closeCart: () => {
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

const meta: Meta<CartComponent> = {
  render: args => ({
    props: args,
    template: `
      <div style="height: 75vh">
        <lib-cart></lib-cart>
      </div>
    `,
  }),
  component: CartComponent,
  title: 'Cart/CartComponent',
  decorators: [
    applicationConfig({
      providers: [provideImageLoader(), provideRouter([]), provideAnimations()],
    }),
    moduleMetadata({
      imports: [CommonModule, NgOptimizedImage, CartItemsComponent],
    }),
  ],
  argTypes: {
    removeItem: { action: 'removeItem', control: false },
    closeCart: { action: 'closeCart', control: false },
  },
  parameters: {
    controls: {
      exclude: ['#cartFacade', 'checkoutButtonEnabled', 'items', 'totalPrice', 'checkoutButtonEnabled', 'showCart'],
    },
  },
};
export default meta;
type Story = StoryObj<CartComponent>;

export const WithItems: Story = {
  decorators: [
    applicationConfig({
      providers: [{ provide: CartFacade, useValue: mockCartFacade(items) }],
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const productImages = canvas.getAllByRole('img');
    const checkoutButton = canvas.getByText('Checkout');
    expect(productImages).toHaveLength(items.length);
    expect(checkoutButton).not.toHaveClass('disabled');
  },
};

export const Empty: Story = {
  decorators: [
    applicationConfig({
      providers: [{ provide: CartFacade, useValue: mockCartFacade([]) }],
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkoutButton = canvas.getByText('Checkout');
    expect(checkoutButton).not.toHaveClass('disabled');
  },
};
