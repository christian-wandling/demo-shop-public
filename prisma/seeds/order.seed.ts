import { Image, Order, OrderStatus, PrismaClient, Product, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { differenceInMonths } from 'date-fns/differenceInMonths';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

const moreThan2MonthsAgo = (date: Date) => differenceInMonths(new Date(), date) > 2;

const getHasOrders = async (prisma: PrismaClient, email: string): Promise<boolean> => {
  const order = await prisma.order.findFirst({
    where: {
      user: {
        email,
      },
    },
  });

  return !!order;
};

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

  dotenv.config();

  const isProduction = (process.env.NODE_ENV as string) === 'production';

  if (isProduction) {
    console.log(`Environment is not development, skip seeding orders`);
  }

  const orders: Order[] = [];

  for (const user of users) {
    const hasOrders = await getHasOrders(prisma, user.email);

    if (hasOrders) {
      continue;
    }

    const orderDates: Date[] = faker.helpers
      .multiple(() => faker.date.past({ years: 2 }), { count: 10 })
      .sort((a, b) => (a > b ? 1 : -1));

    for (let date of orderDates) {
      const status: OrderStatus = moreThan2MonthsAgo(date) ? OrderStatus.Completed : OrderStatus.Created;

      const order: Order = await prisma.order.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          status,
          created_at: date,
        },
      });

      const orderedProducts = faker.helpers.arrayElements(products, { min: 1, max: 8 });

      for (const orderedProduct of orderedProducts) {
        await prisma.orderItem.create({
          data: {
            product_id: orderedProduct.id,
            product_name: orderedProduct.name,
            product_thumbnail: orderedProduct.images[0]?.uri,
            quantity: faker.number.int({ min: 1, max: 10 }),
            price: orderedProduct.price,
            created_at: date,
            order: {
              connect: { id: order.id },
            },
          },
        });
      }

      orders.push(order);
    }
  }

  console.log(`Seeding complete: Added ${orders.length} order(s)`);

  return orders;
};
