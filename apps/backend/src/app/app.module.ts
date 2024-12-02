import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';
import { ShoppingSessionsModule } from './shopping-sessions/shopping-sessions.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { JwtModule } from '@nestjs/jwt';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_API,
      secret: '',
      tokenValidation: TokenValidation.OFFLINE,
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      realmPublicKey: process.env.KEYCLOAK_REALM_PUBLIC_KEY,
      bearerOnly: true,
    }),
    CommonModule,
    ProductsModule,
    UsersModule,
    CartItemsModule,
    OrdersModule,
    ShoppingSessionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
