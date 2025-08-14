import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { SeatType } from '@prisma/client';

export class CreateSeatDto {
  @IsString()
  @IsNotEmpty()
  theater_id: string;

  @IsString()
  @IsNotEmpty()
  seat_number: string;

  @IsString()
  @IsNotEmpty()
  row: string;

  @IsEnum(SeatType)
  @IsNotEmpty()
  seat_type: SeatType;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
