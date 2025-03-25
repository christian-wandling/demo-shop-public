import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { provideRouter } from '@angular/router';
import { importProvidersFrom, signal } from '@angular/core';
import { ProductFacade } from '../../product.facade';
import { ImageResponse, ProductResponse } from '@demo-shop/api';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { faker } from '@faker-js/faker';
import { ProductListComponent } from './product-list.component';
import { provideImageLoader } from '@demo-shop/shared';

const products: ProductResponse[] = Array.from({ length: 12 }).map((_, id) => {
  const name = faker.commerce.productName();
  const image: ImageResponse = {
    name,
    uri: faker.image.urlPicsumPhotos(),
  };

  return {
    id,
    name,
    price: faker.number.int({ min: 1, max: 20 }) * 10 - 1,
    description: faker.commerce.productDescription(),
    categories: [faker.commerce.department()],
    images: [image],
    thumbnail: image,
  };
});

const mockProductFacade = {
  getFiltered: () => signal(products),
  fetchAll: () => {
    return;
  },
};

const meta: Meta<ProductListComponent> = {
  component: ProductListComponent,
  title: 'Product/ProductListComponent',
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, NgOptimizedImage),
        provideImageLoader(),
        provideRouter([{ path: '**', redirectTo: '' }]),
        { provide: ProductFacade, useValue: mockProductFacade },
      ],
    }),
  ],
  parameters: {
    controls: {
      exclude: ['#productFacade', 'products', 'ngOnInit'],
    },
  },
};
export default meta;
type Story = StoryObj<ProductListComponent>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const firstImage: HTMLImageElement = within(canvasElement).getByAltText(products[0].name);
    const images: HTMLImageElement[] = within(canvasElement).getAllByRole('img');
    expect(firstImage).toBeTruthy();
    expect(images).toHaveLength(products.length);
  },
};
