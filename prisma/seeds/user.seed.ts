import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

interface KeycloakUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface KeycloakAdminUser {
  access_token: string;
}

export const seedUsers = async (prisma: PrismaClient): Promise<User[]> => {
  console.log('Seeding users...');

  dotenv.config();

  const users: User[] = [];

  for (const keycloakUser of await getKeycloakUsers()) {
    const user = await prisma.user.create({
      data: {
        firstname: keycloakUser.firstName,
        lastname: keycloakUser.lastName,
        keycloakUser: keycloakUser.id,
        email: keycloakUser.email,
        phone: faker.phone.number(),
        address: {
          create: {
            street: faker.location.streetAddress(),
            apartment: faker.number.int({ max: 100 }).toString(),
            city: faker.location.city(),
            zip: faker.location.zipCode('#####'),
            region: faker.location.state(),
            country: 'United States',
          },
        },
      },
    });

    users.push(user);
  }

  console.log('Seeding users complete');

  return users;
};

const getKeycloakAdminToken = async (): Promise<KeycloakAdminUser> => {
  try {
    const username = process.env.KEYCLOAK_ADMIN as string;
    const password = process.env.KEYCLOAK_ADMIN_PASSWORD as string;

    const res = await fetch('http://localhost:8081/realms/master/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
        grant_type: 'password',
        client_id: 'admin-cli',
      }),
    });

    const data = (await res.json()) as any;

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const getKeycloakUsers = async (): Promise<KeycloakUser[]> => {
  const { access_token } = await getKeycloakAdminToken();

  try {
    const res = await fetch('http://localhost:8081/admin/realms/demo_shop/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = (await res.json()) as any;

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
