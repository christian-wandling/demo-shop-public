import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CatchEverythingFilter } from './catch-everything.filter';

describe('CatchEverythingFilter', () => {
  let filter: CatchEverythingFilter;
  let httpAdapterHost: HttpAdapterHost;
  let mockHttpAdapter: any;
  let mockHost: ArgumentsHost;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockHttpAdapter = {
      getRequestUrl: jest.fn(),
      reply: jest.fn(),
    };

    httpAdapterHost = {
      httpAdapter: mockHttpAdapter,
    } as any;

    mockRequest = {};
    mockResponse = {};

    mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost;

    filter = new CatchEverythingFilter(httpAdapterHost);

    jest.spyOn(Logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HTTP exceptions', () => {
    const mockDate = '2024-01-01T00:00:00.000Z';
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

    const httpException = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    mockHttpAdapter.getRequestUrl.mockReturnValue('/test-url');

    filter.catch(httpException, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      mockResponse,
      {
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: mockDate,
        path: '/test-url',
      },
      HttpStatus.BAD_REQUEST
    );
  });

  it('should handle unknown exceptions', () => {
    const mockDate = '2024-01-01T00:00:00.000Z';
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

    const unknownError = new Error('Unknown error');
    mockHttpAdapter.getRequestUrl.mockReturnValue('/test-url');

    filter.catch(unknownError, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      mockResponse,
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: mockDate,
        path: '/test-url',
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  });

  it('should log errors in non-production environment', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');
    mockHttpAdapter.getRequestUrl.mockReturnValue('/test-url');

    filter.catch(error, mockHost);

    expect(Logger.error).toHaveBeenCalled();
  });

  it('should not log errors in production environment', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Test error');
    mockHttpAdapter.getRequestUrl.mockReturnValue('/test-url');

    filter.catch(error, mockHost);

    expect(Logger.error).not.toHaveBeenCalled();
  });

  it('should handle exceptions without message or stack', () => {
    const mockDate = '2024-01-01T00:00:00.000Z';
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

    const exception = {};
    mockHttpAdapter.getRequestUrl.mockReturnValue('/test-url');

    filter.catch(exception, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      mockResponse,
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: mockDate,
        path: '/test-url',
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  });
});
