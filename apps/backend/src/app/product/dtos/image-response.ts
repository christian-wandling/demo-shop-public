import { Image } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for image data.
 *
 * This class defines the structure of image data returned in API responses.
 */
export class ImageResponse {
  /**
   * The name of the image.
   */
  @ApiProperty()
  readonly name: string;

  /**
   * The URI path to access the image resource.
   */
  @ApiProperty()
  readonly uri: string;
}

/**
 * Transforms an Image domain model into an ImageResponse DTO.
 *
 * @param image - The image domain model to transform
 * @returns An ImageResponse object containing the formatted image data
 */
export const toImageResponse = (image: Image): ImageResponse => {
  return {
    name: image.name,
    uri: image.uri,
  };
};
