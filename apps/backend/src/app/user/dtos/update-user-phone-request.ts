import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPhoneRequest {
  @ApiProperty()
  phone?: string | null;
}
