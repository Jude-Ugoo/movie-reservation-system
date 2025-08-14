import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatus } from '@prisma/client';

export class CreateReservationSeatDto {
  @IsString()
  reservation_id: string;

  @IsString()
  seat_id: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsEnum(ReservationStatus)
  status?: ReservationStatus; // Optional as we'll set it to HELD by default
}
