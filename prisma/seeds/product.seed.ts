import { Image, PrismaClient, Product } from '@prisma/client';
import { faker, tr } from '@faker-js/faker';

export const seedProducts = async (prisma: PrismaClient): Promise<Array<Product & { images: Image[] }>> => {
  console.log('Seeding products...');

  const categories = await prisma.category.createManyAndReturn({
    data: faker.helpers.uniqueArray(faker.commerce.department, 5).map(name => ({
      name,
    })),
  });

  const products = [];

  for (const name of faker.helpers.uniqueArray(faker.commerce.productName, 30)) {
    const category = categories[Math.floor(Math.random() * categories.length)];

    const image = await prisma.image.create({
      data: {
        name,
        uri: faker.image.urlLoremFlickr({
          width: 320,
          height: 320,
          category: `product,${name.split(' ').reverse()[0]}`,
        }),
      },
    });

    const product = await prisma.product.create({
      data: {
        name,
        price: faker.number.int({ min: 1, max: 20 }) * 10 - 1,
        description: faker.commerce.productDescription(),
        categories: {
          connect: [category],
        },
        images: {
          connect: [image],
        },
      },
      include: {
        images: true,
      },
    });

    products.push(product);
  }

  console.log('Seeding products complete');

  return products;
};
