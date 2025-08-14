import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  reservation_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  payment_status: PaymentStatus;

  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  payment_date: Date;
}
