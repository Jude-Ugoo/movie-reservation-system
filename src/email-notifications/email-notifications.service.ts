import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmailNotificationDto } from './dto/create-email-notification.dto';
import { UpdateEmailNotificationDto } from './dto/update-email-notification.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailNotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createEmailNotificationDto: CreateEmailNotificationDto) {
    try {
      const notification = await this.prisma.emailNotification.create({
        data: {
          ...createEmailNotificationDto,
          sent_at: new Date(),
        },
      });
      return notification;
    } catch (error) {
      throw new Error('Failed to create email notification');
    }
  }

  async findAll() {
    try {
      const notifications = await this.prisma.emailNotification.findMany({
        include: {
          user: true,
          reservation: true,
        },
      });
      return notifications;
    } catch (error) {
      throw new Error('Failed to fetch email notifications');
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.prisma.emailNotification.findUnique({
        where: { notification_id: id },
        include: {
          user: true,
          reservation: true,
        },
      });

      if (!notification) {
        throw new NotFoundException('Email notification not found');
      }

      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch email notification');
    }
  }

  async update(
    id: string,
    updateEmailNotificationDto: UpdateEmailNotificationDto,
  ) {
    try {
      const notification = await this.prisma.emailNotification.update({
        where: { notification_id: id },
        data: updateEmailNotificationDto,
      });
      return notification;
    } catch (error) {
      throw new Error('Failed to update email notification');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.emailNotification.delete({
        where: { notification_id: id },
      });
      return { message: 'Email notification deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete email notification');
    }
  }
}
