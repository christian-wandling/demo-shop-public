import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ShoppingSessionService } from './shopping-session.service';
import { ShoppingSessionRepository } from './shopping-session.repository';
import { ShoppingSessionResponse } from '../dtos/shopping-session-response';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { OrderService } from '../../order/services/order.service';
import { OrderResponse } from '../../order/dtos/order-response';
import { OrderStatus } from '@prisma/client';

describe('ShoppingSessionsService', () => {
  let service: ShoppingSessionService;
  let orderService: jest.Mocked<OrderService>;
  let repository: jest.Mocked<ShoppingSessionRepository>;

  const mockEmail = 'test@example.com';
  const mockSessionId = 1;

  const mockHydratedSession: HydratedShoppingSession = {
    id: mockSessionId,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    cart_items: [],
  };

  const mockSessionResponse: ShoppingSessionResponse = {
    items: [],
    userId: 1,
    id: 1,
  };

  const mockOrderDto: OrderResponse = {
    id: 1,
    userId: 1,
    status: OrderStatus.Created,
    amount: 0,
    created: new Date(),
    items: [],
  };

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    const orderServiceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingSessionService,
        {
          provide: ShoppingSessionRepository,
          useValue: repositoryMock,
        },
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    service = module.get<ShoppingSessionService>(ShoppingSessionService);
    orderService = module.get(OrderService);
    repository = module.get(ShoppingSessionRepository);
  });

  describe('create', () => {
    it('should successfully create a shopping session', async () => {
      repository.create.mockResolvedValue(mockHydratedSession);

      const result = await service.create(mockEmail);

      expect(repository.create).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockSessionResponse);
    });

    it('should throw the right exception when repository returns null', async () => {
      repository.create.mockResolvedValue(null);

      await expect(service.create(mockEmail)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findCurrentSessionForUser', () => {
    it('should return existing session when found', async () => {
      repository.find.mockResolvedValue(mockHydratedSession);

      const result = await service.findCurrentSessionForUser(mockEmail);

      expect(repository.find).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockSessionResponse);
    });

    it('should create new session when existing session not found', async () => {
      repository.find.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockHydratedSession);

      const result = await service.findCurrentSessionForUser(mockEmail);

      expect(repository.find).toHaveBeenCalledWith(mockEmail);
      expect(repository.create).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockSessionResponse);
    });

    it('should throw the right exception when create fails during find', async () => {
      repository.find.mockResolvedValue(null);
      repository.create.mockResolvedValue(null);

      await expect(service.findCurrentSessionForUser(mockEmail)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    const mockId = 123;

    it('should successfully remove a shopping session', async () => {
      repository.remove.mockResolvedValue(mockHydratedSession);

      await service.remove(mockId, mockEmail);

      expect(repository.remove).toHaveBeenCalledWith(mockId, mockEmail);
    });

    it('should throw the right exception when repository returns null', async () => {
      repository.remove.mockResolvedValue(null);

      await expect(service.remove(mockId, mockEmail)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkout', () => {
    it('should successfully checkout and create an order from a shopping session', async () => {
      jest.spyOn(service, 'findCurrentSessionForUser').mockResolvedValue(mockSessionResponse);

      await service.checkout(mockEmail);

      expect(orderService.create).toHaveBeenCalledWith(mockSessionResponse);
    });

    it('should throw the right exception when repository returns null', async () => {
      jest.spyOn(service, 'findCurrentSessionForUser').mockResolvedValue(null);

      await expect(service.checkout(mockEmail)).rejects.toThrow(ForbiddenException);
    });
  });
});
