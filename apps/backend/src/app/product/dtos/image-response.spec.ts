import { toImageResponse } from './image-response';
import { Image } from '@prisma/client';

describe('toImageResponse', () => {
  it('should transform Image to ImageResponse', () => {
    const image: Image = {
      id: 1,
      name: 'test-image',
      uri: 'https://example.com/image.jpg',
      created_at: new Date(),
      updated_at: new Date(),
      product_id: 0,
      deleted: false,
      deleted_at: undefined,
    };

    const result = toImageResponse(image);

    expect(result).toEqual({
      name: image.name,
      uri: image.uri,
    });

    // Verify result is an ImageResponse instance
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('uri');
    expect(Object.keys(result).length).toBe(2);
  });

  it('should maintain data integrity during transformation', () => {
    const image: Image = {
      id: 1,
      name: 'test-image',
      uri: 'https://example.com/image.jpg',
      created_at: new Date(),
      updated_at: new Date(),
      product_id: 0,
      deleted: false,
      deleted_at: undefined,
    };

    const result = toImageResponse(image);

    expect(result.name).toBe(image.name);
    expect(result.uri).toBe(image.uri);
  });
});
