import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EmailNotificationsService } from './email-notifications.service';
import { CreateEmailNotificationDto } from './dto/create-email-notification.dto';
import { UpdateEmailNotificationDto } from './dto/update-email-notification.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Email Notifications')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('email-notifications')
export class EmailNotificationsController {
  constructor(
    private readonly emailNotificationsService: EmailNotificationsService,
  ) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new email notification (Admin only)' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Email notification created successfully',
  // })
  // create(
  //   @Body() createEmailNotificationDto: CreateEmailNotificationDto,
  //   @GetUser('role') role: string,
  // ) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }
  //   return this.emailNotificationsService.create(createEmailNotificationDto);
  // }

  // @Get()
  // @ApiOperation({
  //   summary:
  //     'Get all email notifications (Admin) or user notifications (Customer)',
  // })
  // @ApiResponse({ status: 200, description: 'List of email notifications' })
  // findAll(@GetUser('user_id') userId: string, @GetUser('role') role: string) {
  //   const isAdmin = role === 'ADMIN';
  //   if (isAdmin) {
  //     return this.emailNotificationsService.findAll();
  //   }
  //   return this.emailNotificationsService.findByUser(userId);
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get email notification by ID' })
  // @ApiResponse({ status: 200, description: 'Email notification found' })
  // @ApiResponse({ status: 404, description: 'Email notification not found' })
  // findOne(
  //   @Param('id') id: string,
  //   @GetUser('user_id') userId: string,
  //   @GetUser('role') role: string,
  // ) {
  //   const isAdmin = role === 'ADMIN';
  //   if (isAdmin) {
  //     return this.emailNotificationsService.findOne(id);
  //   }
  //   return this.emailNotificationsService.findOneByUser(id, userId);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update email notification by ID (Admin only)' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Email notification updated successfully',
  // })
  // @ApiResponse({ status: 404, description: 'Email notification not found' })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEmailNotificationDto: UpdateEmailNotificationDto,
  //   @GetUser('role') role: string,
  // ) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }
  //   return this.emailNotificationsService.update(
  //     id,
  //     updateEmailNotificationDto,
  //   );
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete email notification by ID (Admin only)' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Email notification deleted successfully',
  // })
  // @ApiResponse({ status: 404, description: 'Email notification not found' })
  // remove(@Param('id') id: string, @GetUser('role') role: string) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }
  //   return this.emailNotificationsService.remove(id);
  // }
}
