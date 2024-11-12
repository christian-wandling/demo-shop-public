import { ApiResponseProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';
import { IsUrl, MinLength } from 'class-validator';

export class ImageDTO {
  @ApiResponseProperty()
  @MinLength(1)
  name: string;
  @ApiResponseProperty()
  @IsUrl()
  uri: string;
}

export const toImageDTO = (image: Image): ImageDTO => {
  return {
    name: image.name,
    uri: image.uri,
  };
};
