import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ description: 'Showtime ID for the reservation' })
  @IsNotEmpty()
  @IsUUID()
  showtime_id: string;

  @ApiProperty({
    description: 'Total price for the reservation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  total_price?: number;

  @ApiProperty({
    description: 'Whether this is a group booking',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  group_booking?: boolean;

  @ApiProperty({ description: 'Promotion ID if applicable', required: false })
  @IsOptional()
  @IsUUID()
  promotion_id?: string;
}
