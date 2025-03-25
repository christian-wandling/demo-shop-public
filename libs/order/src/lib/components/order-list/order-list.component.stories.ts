import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { provideRouter } from '@angular/router';
import { importProvidersFrom, signal } from '@angular/core';
import { AddressResponse, OrderItemResponse, OrderResponse, OrderStatus, UserResponse } from '@demo-shop/api';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { faker } from '@faker-js/faker';
import { provideImageLoader } from '@demo-shop/shared';
import { OrderListComponent } from './order-list.component';
import { OrderFacade } from '../../order.facade';
import { UserFacade } from '@demo-shop/user';

const orders: OrderResponse[] = Array.from({ length: 10 }).map((_, id) => {
  const items: OrderItemResponse[] = Array.from({
    length: faker.number.int({
      min: 1,
      max: 10,
    }),
  }).map((_, productId) => {
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

  return {
    id,
    amount: items.reduce((acc, curr) => acc + curr.totalPrice, 0),
    created: faker.date.past().toISOString(),
    items,
    status: Object.values(OrderStatus)[id % 2],
    userId: 0,
  };
});

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
  getSortedByStatusAndDate: () => {
    orders.sort((a, b) => {
      if (a.status === b.status) {
        return a.created > b.created ? -1 : 1;
      }

      return a.status === OrderStatus.Created ? -1 : 1;
    });

    return signal(orders);
  },
  fetchAll: () => {
    return;
  },
};

const mockUserFacade = {
  getCurrentUser: () => signal(user),
};

const meta: Meta<OrderListComponent> = {
  component: OrderListComponent,
  title: 'Order/OrderListComponent',
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, NgOptimizedImage),
        provideImageLoader(),
        provideRouter([{ path: '**', redirectTo: '' }]),
        { provide: OrderFacade, useValue: mockOrderFacade },
        { provide: UserFacade, useValue: mockUserFacade },
      ],
    }),
  ],
  parameters: {
    controls: {
      exclude: ['#orderFacade', '#userFacade', 'orders', 'user', 'ngOnInit'],
    },
  },
};
export default meta;
type Story = StoryObj<OrderListComponent>;

export const Default: Story = {
  render: args => ({
    props: args,
    template: `
      <div>
        <div style="height: 4rem; width: 100%; background: #fff; z-index: 10; top: 0; position: sticky"></div>
        <lib-order-list></lib-order-list>
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByText(`${user.firstname} ${user.lastname}`);
    const addressLine1 = canvas.getByText(`${address.street} ${address.apartment}`);
    const addressLine2 = canvas.getByText(`${address.zip} ${address.city}, ${address.region}`);
    const addressLine3 = canvas.getByText(`${address.country}`);
    const orders = canvas.getAllByText('Order #');
    expect(name).toBeTruthy();
    expect(addressLine1).toBeTruthy();
    expect(addressLine2).toBeTruthy();
    expect(addressLine3).toBeTruthy();
    expect(orders).toHaveLength(orders.length);
  },
};
