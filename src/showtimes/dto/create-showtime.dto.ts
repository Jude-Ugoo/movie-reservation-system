import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsString()
  @IsNotEmpty()
  movie_id: string;

  @IsString()
  @IsNotEmpty()
  theater_id: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_time: Date;

  @IsBoolean()
  @IsOptional()
  is_special_event?: boolean;

  @IsString()
  @IsOptional()
  promotion_id?: string;
}
