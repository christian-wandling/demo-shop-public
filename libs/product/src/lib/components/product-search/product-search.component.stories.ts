import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { importProvidersFrom, signal } from '@angular/core';
import { ProductSearchComponent } from './product-search.component';
import { ProductFacade } from '../../product.facade';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const productFilter = signal({ name: '' });

const mockProductFacade = {
  getFilter: () => productFilter,
  setFilter: (filter: { name: string }) => productFilter.set(filter),
};

const mockRouter = {
  navigateByUrl: () => {
    return;
  },
};

const meta: Meta<ProductSearchComponent> = {
  component: ProductSearchComponent,
  title: 'Product/ProductSearchComponent',
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, FormsModule, NgOptimizedImage),
        { provide: ProductFacade, useValue: mockProductFacade },
        { provide: Router, useValue: mockRouter },
      ],
    }),
  ],
  argTypes: {
    setProductNameFilter: { action: 'setProductNameFilter', control: false },
    goToProductPage: { action: 'goToProductPage', control: false },
  },
  parameters: {
    controls: {
      exclude: ['#productFacade', '#router', 'productFilter'],
    },
  },
};
export default meta;
type Story = StoryObj<ProductSearchComponent>;

export const Default: Story = {
  render: args => ({
    props: args,
    template: `
      <div style="width: 300px;">
        <lib-product-search></lib-product-search>
      </div>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    const inputElement = within(canvasElement).getByRole('textbox');
    expect(inputElement).toHaveValue(productFilter().name);
  },
  parameters: {
    assets: ['icons/search.svg', 'icons/enter.svg'],
  },
};
