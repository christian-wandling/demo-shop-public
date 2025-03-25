import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { importProvidersFrom, signal } from '@angular/core';
import { AddressResponse, OrderItemResponse, OrderResponse, OrderStatus, UserResponse } from '@demo-shop/api';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { faker } from '@faker-js/faker';
import { provideImageLoader } from '@demo-shop/shared';
import { OrderDetailComponent } from './order-detail.component';
import { OrderFacade } from '../../order.facade';
import { UserFacade } from '@demo-shop/user';
import { PrintInvoiceService } from '../../services/print-invoice.service';

const items: OrderItemResponse[] = Array.from({ length: 5 }).map((_, productId) => {
  const quantity = faker.number.int({ min: 1, max: 5 });
  const unitPrice = faker.number.int({ min: 1, max: 20 }) * 10 - 1;

  return {
    productId,
    productName: faker.commerce.productName(),
    productThumbnail: faker.image.urlPicsumPhotos(),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
  };
});

const order: OrderResponse = {
  id: 1,
  amount: items.reduce((acc, curr) => acc + curr.totalPrice, 0),
  created: faker.date.past().toISOString(),
  items,
  status: OrderStatus.Created,
  userId: 0,
};

const address: AddressResponse = {
  street: faker.location.streetAddress(),
  apartment: faker.number.int({ max: 100 }).toString(),
  city: faker.location.city(),
  zip: faker.location.zipCode('#####'),
  region: faker.location.state(),
  country: faker.location.country(),
};

const user: UserResponse = {
  id: 1,
  email: faker.internet.email(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  phone: faker.helpers.fromRegExp('+[0-9]{9}'),
  address,
};

const mockOrderFacade = {
  getById: () => signal(order),
  fetchById: () => {
    return;
  },
};

const mockUserFacade = {
  getCurrentUser: () => signal(user),
};

const mockActivatedRoute = {
  snapshot: {
    params: {
      id: 1,
    },
  },
};

const mockPrintInvoiceService = {
  generatePdf: () => {
    return;
  },
};

const meta: Meta<OrderDetailComponent> = {
  component: OrderDetailComponent,
  title: 'Order/OrderDetailComponent',
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, NgOptimizedImage),
        provideImageLoader(),
        { provide: OrderFacade, useValue: mockOrderFacade },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserFacade, useValue: mockUserFacade },
        { provide: PrintInvoiceService, useValue: mockPrintInvoiceService },
      ],
    }),
  ],
  argTypes: {
    printPdf: { action: 'printPdf', control: false },
  },
  parameters: {
    controls: {
      exclude: ['#activatedRoute', '#orderFacade', '#userFacade', '#printInvoiceService', 'order', 'user', 'ngOnInit'],
    },
  },
};
export default meta;
type Story = StoryObj<OrderDetailComponent>;

export const Default: Story = {
  render: args => ({
    props: args,
    template: `
      <div>
        <div style="height: 4rem; width: 100%; background: #fff; z-index: 10; top: 0; position: sticky"></div>
        <lib-order-detail></lib-order-detail>
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const name = within(canvasElement).getByText(`${user.firstname} ${user.lastname}`);
    const addressLine1 = within(canvasElement).getByText(`${address.street} ${address.apartment}`);
    const addressLine2 = within(canvasElement).getByText(`${address.zip} ${address.city}, ${address.region}`);
    const addressLine3 = within(canvasElement).getByText(`${address.country}`);
    const printPdfButton = within(canvasElement).getByRole('button');
    const productImages = within(canvasElement).getAllByRole('img');
    expect(name).toBeTruthy();
    expect(addressLine1).toBeTruthy();
    expect(addressLine2).toBeTruthy();
    expect(addressLine3).toBeTruthy();
    expect(printPdfButton).toBeTruthy();
    expect(productImages).toHaveLength(items.length);
  },
};
