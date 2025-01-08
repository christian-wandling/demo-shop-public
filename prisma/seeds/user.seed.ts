import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

interface keycloakUserId {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface KeycloakAdminUser {
  access_token: string;
}

const getHasUser = async (prisma: PrismaClient, email: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return !!user;
};

export const seedUsers = async (prisma: PrismaClient): Promise<User[]> => {
  console.log('Seeding users...');

  dotenv.config();

  const users: User[] = [];

  for (const keycloakUserId of await getKeycloakUserIds()) {
    const hasUser = await getHasUser(prisma, keycloakUserId.email);

    if (hasUser) {
      continue;
    }

    const user = await prisma.user.create({
      data: {
        firstname: keycloakUserId.firstName,
        lastname: keycloakUserId.lastName,
        keycloakUserId: keycloakUserId.id,
        email: keycloakUserId.email,
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

  console.log(`Seeding complete: Added ${users.length} user(s)`);

  return users;
};

const getKeycloakAdminToken = async (): Promise<KeycloakAdminUser> => {
  try {
    const username = process.env.KEYCLOAK_ADMIN as string;
    const password = process.env.KEYCLOAK_ADMIN_PASSWORD as string;
    const keycloakUrl = process.env.KEYCLOAK_URL as string;
    const url = `${keycloakUrl}/realms/master/protocol/openid-connect/token`;

    const res = await fetch(url, {
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

    if (!res.ok) {
      console.log('Hello');

      const errorBody = await res.text();
      console.error(`Error: ${res.statusText}, Body: ${errorBody}`);
      throw new Error(`Error: ${res.statusText}, Body: ${errorBody}`);
    }

    return (await res.json()) as KeycloakAdminUser;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const getKeycloakUserIds = async (): Promise<keycloakUserId[]> => {
  const { access_token } = await getKeycloakAdminToken();
  const keycloakUrl = process.env.KEYCLOAK_URL as string;
  const keycloakRealm = process.env.KEYCLOAK_REALM as string;
  const url = `${keycloakUrl}/admin/realms/${keycloakRealm}/users`;
  console.log(url);

  try {
    const res = await fetch(url, {
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
