import { Test, TestingModule } from '@nestjs/testing';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './services/cart-item.service';
import { CartItemResponse } from './dtos/cart-item-response';
import { ForbiddenException, NotFoundException, RequestMethod } from '@nestjs/common';
import { ShoppingSessionResponse } from '../shopping-session/dtos/shopping-session-response';
import { ShoppingSessionService } from '../shopping-session/services/shopping-session.service';
import { DecodedToken } from '../common/entities/decoded-token';
import { UpdateCartItemQuantityRequest } from './dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from './dtos/add-cart-item-request';

describe('CartItemsController', () => {
  let controller: CartItemController;
  let cartItemsService: CartItemService;
  let shoppingSessionsService: ShoppingSessionService;

  const mockCartItemDto: CartItemResponse = {
    id: 123,
    productId: 456,
    quantity: 1,
    productName: 'Test Product',
    productThumbnail: 'https://example.com/image.jpg',
    unitPrice: 19.99,
    totalPrice: 19.99,
  };

  const mockShoppingSessionDto: ShoppingSessionResponse = {
    id: 123,
    items: [],
    userId: 789,
  };

  const mockDecodedToken: DecodedToken = {
    given_name: 'given_name',
    family_name: 'family_name',
    sub: 'sub',
    email: 'email@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: CartItemService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCartItemDto),
            update: jest.fn().mockResolvedValue(mockCartItemDto),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ShoppingSessionService,
          useValue: {
            findCurrentSessionForUser: jest.fn(),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(CartItemController);
    cartItemsService = module.get(CartItemService);
    shoppingSessionsService = module.get(ShoppingSessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CartItemController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController);
      expect(path).toBe('shopping-sessions/current/cart-items');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', CartItemController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', CartItemController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('createCartItem', () => {
    const createDto: AddCartItemRequest = {
      productId: 1,
    };

    it('should create a cart item successfully', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);
      jest.spyOn(cartItemsService, 'create').mockResolvedValue(mockCartItemDto);

      const result = await controller.createCartItem(createDto, mockDecodedToken);

      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(cartItemsService.create).toHaveBeenCalledWith(createDto, mockShoppingSessionDto.id);
      expect(result).toEqual(mockCartItemDto);
    });

    it('should throw the right exception when no shopping session found', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(controller.createCartItem(createDto, mockDecodedToken)).rejects.toThrow(ForbiddenException);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController.prototype.createCartItem);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', CartItemController.prototype.createCartItem);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('updateCartItem', () => {
    const cartItemId = 123;
    const updateDto: UpdateCartItemQuantityRequest = {
      quantity: 3,
    };

    it('should update a cart item successfully', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);
      jest.spyOn(cartItemsService, 'update').mockResolvedValue({
        ...mockCartItemDto,
        quantity: updateDto.quantity,
      });

      const result = await controller.updateCartItem(cartItemId, updateDto, mockDecodedToken);

      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(cartItemsService.update).toHaveBeenCalledWith(cartItemId, updateDto, mockShoppingSessionDto.id);
      expect(result).toEqual({
        ...mockCartItemDto,
        quantity: updateDto.quantity,
      });
    });

    it('should throw the right exception when no shopping session found', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(controller.updateCartItem(cartItemId, updateDto, mockDecodedToken)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController.prototype.updateCartItem);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', CartItemController.prototype.updateCartItem);
      expect(method).toEqual(RequestMethod.PATCH);
    });
  });

  describe('removeCartItem', () => {
    const cartItemId = 123;

    it('should remove a cart item successfully', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);
      jest.spyOn(cartItemsService, 'remove').mockResolvedValue(undefined);

      await controller.removeCartItem(cartItemId, mockDecodedToken);

      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(cartItemsService.remove).toHaveBeenCalledWith(cartItemId, mockShoppingSessionDto.id);
    });

    it('should throw the right exception when no shopping session found', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(controller.removeCartItem(cartItemId, mockDecodedToken)).rejects.toThrow(ForbiddenException);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController.prototype.removeCartItem);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', CartItemController.prototype.removeCartItem);
      expect(method).toEqual(RequestMethod.DELETE);
    });
  });
});
