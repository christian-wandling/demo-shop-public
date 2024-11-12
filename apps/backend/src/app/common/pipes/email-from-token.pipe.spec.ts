import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { EmailFromTokenPipe } from './email-from-token.pipe';

describe('EmailFromTokenPipe', () => {
  let pipe: EmailFromTokenPipe;
  let jwtService: JwtService;

  const mockJwtService = {
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailFromTokenPipe,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    pipe = module.get<EmailFromTokenPipe>(EmailFromTokenPipe);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should extract email from valid Bearer token', () => {
    const token = 'valid.jwt.token';
    const email = 'test@example.com';
    const authHeader = `Bearer ${token}`;

    mockJwtService.decode.mockReturnValue({ email });

    const result = pipe.transform(authHeader, {} as any);

    expect(result).toBe(email);
    expect(jwtService.decode).toHaveBeenCalledWith(token);
  });

  it('should return undefined for non-Bearer token', () => {
    const authHeader = 'Basic sometoken';

    const result = pipe.transform(authHeader, {} as any);

    expect(result).toBeUndefined();
    expect(jwtService.decode).not.toHaveBeenCalled();
  });

  it('should handle missing token', () => {
    const authHeader = 'Bearer ';

    mockJwtService.decode.mockReturnValue({ email: undefined });

    const result = pipe.transform(authHeader, {} as any);

    expect(result).toBeUndefined();
  });
});
