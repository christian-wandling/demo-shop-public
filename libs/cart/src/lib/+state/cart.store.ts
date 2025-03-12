import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withCallState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import {
  AddCartItemRequest,
  CartItemResponse,
  ShoppingSessionApi,
  UpdateCartItemQuantityRequest,
} from '@demo-shop/api';
import { firstValueFrom } from 'rxjs';

interface AdditionalState {
  showCart: boolean;
  shoppingSessionId: number | null;
}

const initialState: AdditionalState = { showCart: false, shoppingSessionId: null };

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<AdditionalState>(initialState),
  withCallState(),
  withDevtools('cart'),
  withEntities<CartItemResponse>(),
  withComputed(store => ({
    totalPrice: computed(() => store.entities().reduce((acc, curr) => acc + curr.totalPrice, 0)),
    itemCount: computed(() => store.entities().reduce((acc, curr) => acc + curr.quantity, 0)),
    hasShoppingSession: computed(() => !!store.shoppingSessionId()),
  })),
  withMethods((store, shoppingSessionApi = inject(ShoppingSessionApi)) => ({
    async loadShoppingSession(): Promise<void> {
      const shoppingSession = await firstValueFrom(shoppingSessionApi.resolveCurrentShoppingSession());

      patchState(store, setAllEntities(shoppingSession.items), { shoppingSessionId: shoppingSession.id });
    },
    async create(dto: AddCartItemRequest): Promise<void> {
      if (!store.shoppingSessionId()) {
        throw new Error('Missing shopping session id');
      }

      await firstValueFrom(shoppingSessionApi.addCartItem(dto));
      await this.loadShoppingSession();
    },
    async delete(id: number): Promise<void> {
      if (!store.shoppingSessionId()) {
        throw new Error('Missing shopping session id');
      }

      await firstValueFrom(shoppingSessionApi.removeCartItem(id));
      await this.loadShoppingSession();
    },
    async update(id: number, entity: UpdateCartItemQuantityRequest): Promise<void> {
      if (!store.shoppingSessionId()) {
        throw new Error('Missing shopping session id');
      }

      await firstValueFrom(shoppingSessionApi.updateCartItemQuantity(id, entity));
      await this.loadShoppingSession();
    },
    getItemById(id: number): CartItemResponse | undefined {
      return store.entityMap()[id];
    },
    getItemByProductId(productId: number): CartItemResponse | undefined {
      return store.entities().find(item => item.productId === productId);
    },
    setShowCart(showCart: boolean): void {
      patchState(store, { showCart });
    },
  }))
);
