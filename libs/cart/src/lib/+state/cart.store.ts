import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withCallState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { CartItemDTO, CartItemsApi, CreateCartItemDTO, ShoppingSessionsApi, UpdateCartItemDTO } from '@demo-shop/api';
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
  withEntities<CartItemDTO>(),
  withComputed(store => ({
    totalPrice: computed(() => store.entities().reduce((acc, curr) => acc + curr.totalPrice, 0)),
    itemCount: computed(() => store.entities().reduce((acc, curr) => acc + curr.quantity, 0)),
    hasShoppingSession: computed(() => !!store.shoppingSessionId()),
  })),
  withMethods((store, shoppingSessionsApi = inject(ShoppingSessionsApi), cartItemsApi = inject(CartItemsApi)) => ({
    async loadShoppingSession(): Promise<void> {
      const shoppingSession = await firstValueFrom(shoppingSessionsApi.getShoppingSessionOfCurrentUser());

      patchState(store, setAllEntities(shoppingSession.items), { shoppingSessionId: shoppingSession.id });
    },
    async create(dto: CreateCartItemDTO): Promise<void> {
      if (!store.shoppingSessionId()) {
        throw new Error('Missing shopping session id');
      }

      await firstValueFrom(cartItemsApi.createCartItem(dto));
      await this.loadShoppingSession();
    },
    async delete(id: number): Promise<void> {
      if (!store.shoppingSessionId()) {
        throw new Error('Missing shopping session id');
      }

      await firstValueFrom(cartItemsApi.removeCartItem(id));
      await this.loadShoppingSession();
    },
    async update(id: number, entity: UpdateCartItemDTO): Promise<void> {
      if (!store.shoppingSessionId()) {
        throw new Error('Missing shopping session id');
      }

      await firstValueFrom(cartItemsApi.updateCartItem(id, entity));
      await this.loadShoppingSession();
    },
    getItemById(id: number): CartItemDTO | undefined {
      return store.entityMap()[id];
    },
    getItemByProductId(productId: number): CartItemDTO | undefined {
      return store.entities().find(item => item.productId === productId);
    },
    setShowCart(showCart: boolean): void {
      patchState(store, { showCart });
    },
  }))
);
