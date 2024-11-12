import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import { ShoppingSessionsRepository } from './shopping-sessions.repository';
import { ShoppingSessionDTO } from '../dtos/shopping-session-dto';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { Decimal } from '@prisma/client/runtime/library';

describe('ShoppingSessionsService', () => {
  let service: ShoppingSessionsService;
  let repository: jest.Mocked<ShoppingSessionsRepository>;

  const mockEmail = 'test@example.com';
  const mockSessionId = 1;

  const mockHydratedSession: HydratedShoppingSession = {
    id: mockSessionId,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    cartItems: [],
  };

  const mockSessionDTO: ShoppingSessionDTO = {
    items: [],
    userId: '1',
    id: '1',
  };

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingSessionsService,
        {
          provide: ShoppingSessionsRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ShoppingSessionsService>(ShoppingSessionsService);
    repository = module.get(ShoppingSessionsRepository);
  });

  describe('create', () => {
    it('should successfully create a shopping session', async () => {
      repository.create.mockResolvedValue(mockHydratedSession);

      const result = await service.create(mockEmail);

      expect(repository.create).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockSessionDTO);
    });

    it('should throw InternalServerErrorException when repository returns null', async () => {
      repository.create.mockResolvedValue(null);

      await expect(service.create(mockEmail)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findCurrentSessionForUser', () => {
    it('should return existing session when found', async () => {
      repository.find.mockResolvedValue(mockHydratedSession);

      const result = await service.findCurrentSessionForUser(mockEmail);

      expect(repository.find).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockSessionDTO);
    });

    it('should create new session when existing session not found', async () => {
      repository.find.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockHydratedSession);

      const result = await service.findCurrentSessionForUser(mockEmail);

      expect(repository.find).toHaveBeenCalledWith(mockEmail);
      expect(repository.create).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockSessionDTO);
    });

    it('should throw InternalServerErrorException when create fails during find', async () => {
      repository.find.mockResolvedValue(null);
      repository.create.mockResolvedValue(null);

      await expect(service.findCurrentSessionForUser(mockEmail)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    const mockId = '123';

    it('should successfully remove a shopping session', async () => {
      repository.remove.mockResolvedValue(mockHydratedSession);

      await service.remove(mockId, mockEmail);

      expect(repository.remove).toHaveBeenCalledWith(mockId, mockEmail);
    });

    it('should throw InternalServerErrorException when repository returns null', async () => {
      repository.remove.mockResolvedValue(null);

      await expect(service.remove(mockId, mockEmail)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
