import { seedUsers } from './seeds/user.seed';
import { PrismaClient } from '@prisma/client';
import { seedProducts } from './seeds/product.seed';
import { seedOrders } from './seeds/order.seed';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

async function seed() {
  const prisma = new PrismaClient();

  dotenv.config();

  const isProduction = (process.env.NODE_ENV as string) === 'production';

  try {
    const users = await seedUsers(prisma);
    const products = await seedProducts(prisma);

    if (!isProduction) {
      await seedOrders(prisma, users, products);
    }

    await prisma.$disconnect();
    console.log('Seeding completed successfully');
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed().catch(err => {
  console.error(err);
});
