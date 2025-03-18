import { Test, TestingModule } from '@nestjs/testing';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from '../services/cart-item.service';
import { CartItemResponse } from '../dtos/cart-item-response';
import { NotFoundException, RequestMethod } from '@nestjs/common';
import { ShoppingSessionResponse } from '../../shopping-session/dtos/shopping-session-response';
import { ShoppingSessionService } from '../../shopping-session/services/shopping-session.service';
import { DecodedToken } from '../../common/models/decoded-token';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

describe('CartItemController', () => {
  let controller: CartItemController;
  let cartItemService: CartItemService;
  let shoppingSessionService: ShoppingSessionService;

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
    cartItemService = module.get(CartItemService);
    shoppingSessionService = module.get(ShoppingSessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CartItemController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController);
      expect(path).toBe('shopping-sessions');
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
      jest.spyOn(shoppingSessionService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);
      jest.spyOn(cartItemService, 'create').mockResolvedValue(mockCartItemDto);

      const result = await controller.addCartItem(createDto, mockDecodedToken);

      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(cartItemService.create).toHaveBeenCalledWith(createDto, mockShoppingSessionDto.id);
      expect(result).toEqual(mockCartItemDto);
    });

    it('should throw the right exception when no shopping session found', async () => {
      jest.spyOn(shoppingSessionService, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(controller.addCartItem(createDto, mockDecodedToken)).rejects.toThrow(NotFoundException);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController.prototype.addCartItem);
      expect(path).toEqual('/current/cart-items');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', CartItemController.prototype.addCartItem);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('updateCartItem', () => {
    const id = 1;
    const updateDto: UpdateCartItemQuantityRequest = {
      quantity: 3,
    };

    it('should update a cart item successfully', async () => {
      jest.spyOn(shoppingSessionService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);
      jest.spyOn(cartItemService, 'update').mockResolvedValue({
        ...mockCartItemDto,
        quantity: updateDto.quantity,
      });

      const result = await controller.updateCartItemQuantity(id, updateDto, mockDecodedToken);

      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(cartItemService.update).toHaveBeenCalledWith(Number(id), updateDto, mockShoppingSessionDto.id);
      expect(result).toEqual({
        ...mockCartItemDto,
        quantity: updateDto.quantity,
      });
    });

    it('should throw the right exception when no shopping session found', async () => {
      jest.spyOn(shoppingSessionService, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(controller.updateCartItemQuantity(id, updateDto, mockDecodedToken)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController.prototype.updateCartItemQuantity);
      expect(path).toEqual('/current/cart-items/:id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', CartItemController.prototype.updateCartItemQuantity);
      expect(method).toEqual(RequestMethod.PATCH);
    });
  });

  describe('removeCartItem', () => {
    const id = 1;

    it('should remove a cart item successfully', async () => {
      jest.spyOn(shoppingSessionService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);
      jest.spyOn(cartItemService, 'remove').mockResolvedValue(undefined);

      await controller.removeCartItem(id, mockDecodedToken);

      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(cartItemService.remove).toHaveBeenCalledWith(Number(id), mockShoppingSessionDto.id);
    });

    it('should throw the right exception when no shopping session found', async () => {
      jest.spyOn(shoppingSessionService, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(controller.removeCartItem(id, mockDecodedToken)).rejects.toThrow(NotFoundException);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', CartItemController.prototype.removeCartItem);
      expect(path).toEqual('/current/cart-items/:id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', CartItemController.prototype.removeCartItem);
      expect(method).toEqual(RequestMethod.DELETE);
    });
  });
});
