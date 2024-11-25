import { Controller, ExecutionContext, Get } from '@nestjs/common';
import { CustomHeaders } from './custom-headers.decorator';
import { Test, TestingModule } from '@nestjs/testing';

@Controller('test')
class TestController {
  @Get()
  test(@CustomHeaders() headers: any, @CustomHeaders('x-custom-header') specificHeader: string) {
    return { headers, specificHeader };
  }
}

describe('CustomHeaders Decorator', () => {
  let controller: TestController;
  const mockHeaders = {
    'x-custom-header': 'value1',
    'another-header': 'value2',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  it('should extract headers correctly', async () => {
    const result = await (controller as any).test.call(controller, mockHeaders, 'value1');

    expect(result).toEqual({
      headers: mockHeaders,
      specificHeader: 'value1',
    });
  });
});
