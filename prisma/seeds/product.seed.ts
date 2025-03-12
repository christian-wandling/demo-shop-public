import { Image, PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
// import { generateDescription } from './ai-generate';

const getHasProducts = async (prisma: PrismaClient) => {
  const product = await prisma.product.findFirst();

  return !!product;
};

export const seedProducts = async (prisma: PrismaClient): Promise<Array<Product & { images: Image[] }>> => {
  console.log('Seeding products...');

  const hasProducts = await getHasProducts(prisma);

  if (hasProducts) {
    console.log(`Products table is not empty, skip seeding products`);

    return [];
  }

  const products = [];

  const categories = await prisma.category.createManyAndReturn({
    data: faker.helpers.uniqueArray(faker.commerce.department, 5).map(name => ({
      name,
    })),
  });

  for (const name of faker.helpers.uniqueArray(faker.commerce.productName, 30)) {
    const category = categories[Math.floor(Math.random() * categories.length)];

    const image = await prisma.image.create({
      data: {
        name,
        uri: faker.image.urlPicsumPhotos(),
      },
    });

    const product = await prisma.product.create({
      data: {
        name,
        price: faker.number.int({ min: 1, max: 20 }) * 10 - 1,
        description: faker.commerce.productDescription(),
        categories: {
          create: [{ category_id: category.id }],
        },
        images: {
          connect: [{ id: image.id }],
        },
      },
      include: {
        images: true,
      },
    });

    products.push(product);
  }

  console.log(`Seeding complete: Added ${products.length} products(s)`);

  return products;
};
