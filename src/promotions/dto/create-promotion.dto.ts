import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  discount_type: string;

  @IsNumber()
  @IsNotEmpty()
  discount_value: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_date: Date;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
