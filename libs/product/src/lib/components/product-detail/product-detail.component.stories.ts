import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { importProvidersFrom, signal } from '@angular/core';
import { ProductDetailComponent } from './product-detail.component';
import { ProductFacade } from '../../product.facade';
import { ImageResponse, ProductResponse } from '@demo-shop/api';
import { CartFacade } from '@demo-shop/cart';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { faker } from '@faker-js/faker';
import { provideImageLoader } from '@demo-shop/shared';

const name = faker.commerce.productName();
const image: ImageResponse = {
  name,
  uri: faker.image.urlPicsumPhotos(),
};

const product: ProductResponse = {
  id: 1,
  name,
  price: faker.number.int({ min: 1, max: 20 }) * 10 - 1,
  description: faker.commerce.productDescription(),
  categories: [faker.commerce.department()],
  images: [image],
  thumbnail: image,
};

const mockProductFacade = (product: ProductResponse) => ({
  getById: () => signal(product),
  fetchById: () => {
    return;
  },
});

const mockCartFacade = (hasShoppingSession: boolean) => ({
  getHasShoppingSession: () => signal(hasShoppingSession),
  addItem: () => {
    return;
  },
});

const mockActivatedRoute = {
  snapshot: {
    params: {
      id: 1,
    },
  },
};

const meta: Meta<ProductDetailComponent> = {
  component: ProductDetailComponent,
  title: 'Product/ProductDetailComponent',
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, NgOptimizedImage),
        provideImageLoader(),
        { provide: ProductFacade, useValue: mockProductFacade(product) },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CartFacade, useValue: mockCartFacade(false) },
      ],
    }),
  ],
  argTypes: {
    addToCart: { action: 'addToCart', control: false },
  },
  parameters: {
    controls: {
      exclude: ['#activatedRoute', '#productFacade', '#cartFacade', 'product', 'addButtonEnabled', 'ngOnInit'],
    },
  },
};
export default meta;
type Story = StoryObj<ProductDetailComponent>;

export const Unauthenticated: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    expect(button).toBeDisabled();
  },
};

export const Authenticated: Story = {
  decorators: [
    applicationConfig({
      providers: [{ provide: CartFacade, useValue: mockCartFacade(true) }],
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    expect(button).not.toBeDisabled();
  },
};
