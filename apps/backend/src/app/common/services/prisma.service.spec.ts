import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

// Create a mock implementation of PrismaService
class MockPrismaService extends PrismaService {
  constructor() {
    super();
    this.$connect = jest.fn();
  }
}

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to the database on module init', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });
});
