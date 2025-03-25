import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CartItemResponse } from '@demo-shop/api';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { faker } from '@faker-js/faker';
import { provideImageLoader } from '@demo-shop/shared';
import { CartItemsComponent } from './cart-items.component';

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

const meta: Meta<CartItemsComponent> = {
  component: CartItemsComponent,
  title: 'Cart/CartItemsComponent',
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, NgOptimizedImage),
        provideImageLoader(),
        provideRouter([{ path: '**', redirectTo: '' }]),
      ],
    }),
  ],
  argTypes: {
    removeItem: { action: 'removeItem', control: false },
  },
};
export default meta;
type Story = StoryObj<CartItemsComponent>;

export const Default: Story = {
  args: {
    items,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const productImages = canvas.getAllByRole('img');
    expect(productImages).toHaveLength(items.length);
  },
};
