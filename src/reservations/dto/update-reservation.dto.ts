import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiProperty({
    description: 'Whether this is a group booking',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  group_booking?: boolean;

  @ApiProperty({
    description: 'Total price for the reservation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  total_price?: number;
}
