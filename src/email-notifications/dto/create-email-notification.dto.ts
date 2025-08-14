import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateEmailNotificationDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  reservation_id: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  notification_type: NotificationType;

  @IsString()
  @IsNotEmpty()
  status: string;
}
