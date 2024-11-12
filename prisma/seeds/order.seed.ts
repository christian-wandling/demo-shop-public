import { Image, Order, OrderStatus, PrismaClient, Product, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { differenceInMonths } from 'date-fns/differenceInMonths';

const MORE_THAN_MONTHS_AGO = (date: Date) => differenceInMonths(new Date(), date) > 2;

export const seedOrders = async (
  prisma: PrismaClient,
  users: User[],
  products: Array<
    Product & {
      images: Image[];
    }
  >
): Promise<Order[]> => {
  console.log('Seeding orders...');

  const orders: Order[] = [];

  for (const user of users) {
    const orderDates: Date[] = faker.helpers
      .multiple(() => faker.date.past({ years: 2 }), { count: 10 })
      .sort((a, b) => (a > b ? 1 : -1));

    for (let date of orderDates) {
      let status: OrderStatus = OrderStatus.CREATED;

      if (MORE_THAN_MONTHS_AGO(date)) {
        status = OrderStatus.COMPLETED;
      }

      const order: Order = await prisma.order.create({
        data: {
          user: {
            connect: user,
          },
          status,
          createdAt: date,
        },
      });

      const orderedProducts = faker.helpers.arrayElements(products, { min: 1, max: 8 });

      for (const orderedProduct of orderedProducts) {
        await prisma.orderItem.create({
          data: {
            productId: orderedProduct.id,
            productName: orderedProduct.name,
            productThumbnail: orderedProduct.images[0]?.uri,
            quantity: faker.number.int({ min: 1, max: 10 }),
            price: orderedProduct.price,
            createdAt: date,
            order: {
              connect: order,
            },
          },
        });
      }
    }
  }

  console.log('Seeding orders complete');

  return orders;
};
