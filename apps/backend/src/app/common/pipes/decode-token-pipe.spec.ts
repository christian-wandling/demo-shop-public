import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { DecodeTokenPipe } from './decode-token-pipe';
import { DecodedToken } from '../entities/decoded-token';

describe('DecodeTokenPipe', () => {
  let pipe: DecodeTokenPipe;
  let jwtService: JwtService;

  const mockDecodedToken: DecodedToken = {
    given_name: 'given_name',
    family_name: 'family_name',
    sub: 'sub',
    email: 'email@email.com',
  };

  const mockJwtService = {
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecodeTokenPipe,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    pipe = module.get<DecodeTokenPipe>(DecodeTokenPipe);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return decoded user from valid Bearer token', () => {
    const token = 'valid.jwt.token';
    const authHeader = `Bearer ${token}`;

    mockJwtService.decode.mockReturnValue(mockDecodedToken);

    const result = pipe.transform(authHeader, {} as any);

    expect(result).toEqual(mockDecodedToken);
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

    mockJwtService.decode.mockReturnValue(undefined);

    const result = pipe.transform(authHeader, {} as any);

    expect(result).toBeUndefined();
  });
});
