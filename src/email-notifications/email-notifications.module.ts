import { Module } from '@nestjs/common';
import { EmailNotificationsService } from './email-notifications.service';
import { EmailNotificationsController } from './email-notifications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
  controllers: [EmailNotificationsController],
  providers: [EmailNotificationsService],
})
export class EmailNotificationsModule {}
