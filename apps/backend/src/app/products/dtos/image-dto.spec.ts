import { validate } from 'class-validator';
import { ImageDTO, toImageDTO } from './image-dto';
import { Image } from '@prisma/client';

describe('ImageDTO', () => {
  let imageDTO: ImageDTO;

  beforeEach(() => {
    imageDTO = new ImageDTO();
    imageDTO.name = 'test-image';
    imageDTO.uri = 'https://example.com/image.jpg';
  });

  describe('name validation', () => {
    it('should pass with valid name', async () => {
      const errors = await validate(imageDTO);
      expect(errors.length).toBe(0);
    });

    it('should fail with empty name', async () => {
      imageDTO.name = '';
      const errors = await validate(imageDTO);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });
  });

  describe('uri validation', () => {
    it('should pass with valid URL', async () => {
      const errors = await validate(imageDTO);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid URL', async () => {
      imageDTO.uri = 'not-a-url';
      const errors = await validate(imageDTO);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('uri');
      expect(errors[0].constraints).toHaveProperty('isUrl');
    });
  });
});

describe('toImageDTO', () => {
  it('should transform Image to ImageDTO', () => {
    const image: Image = {
      id: 1,
      name: 'test-image',
      uri: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: 0,
      deleted: false,
      deletedAt: undefined,
    };

    const result = toImageDTO(image);

    expect(result).toEqual({
      name: image.name,
      uri: image.uri,
    });

    // Verify result is an ImageDTO instance
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('uri');
    expect(Object.keys(result).length).toBe(2);
  });

  it('should maintain data integrity during transformation', () => {
    const image: Image = {
      id: 1,
      name: 'test-image',
      uri: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: 0,
      deleted: false,
      deletedAt: undefined,
    };

    const result = toImageDTO(image);

    expect(result.name).toBe(image.name);
    expect(result.uri).toBe(image.uri);
  });
});
