import { Image } from '@prisma/client';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ImageResponse {
  @ApiResponseProperty()
  readonly name: string;
  @ApiResponseProperty()
  readonly uri: string;
}

export const toImageResponse = (image: Image): ImageResponse => {
  return {
    name: image.name,
    uri: image.uri,
  };
};
