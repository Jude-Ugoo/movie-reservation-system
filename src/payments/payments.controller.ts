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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new payment' })
  // @ApiResponse({ status: 201, description: 'Payment created successfully' })
  // create(
  //   @Body() createPaymentDto: CreatePaymentDto,
  //   @GetUser('user_id') userId: string,
  // ) {
  //   return this.paymentsService.create(createPaymentDto, userId);
  // }

  // @Get()
  // @ApiOperation({
  //   summary: 'Get all payments (Admin) or user payments (Customer)',
  // })
  // @ApiResponse({ status: 200, description: 'List of payments' })
  // findAll(@GetUser('user_id') userId: string, @GetUser('role') role: string) {
  //   const isAdmin = role === 'ADMIN';
  //   if (isAdmin) {
  //     return this.paymentsService.findAll();
  //   }
  //   return this.paymentsService.findByUser(userId);
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get payment by ID' })
  // @ApiResponse({ status: 200, description: 'Payment found' })
  // @ApiResponse({ status: 404, description: 'Payment not found' })
  // findOne(
  //   @Param('id') id: string,
  //   @GetUser('user_id') userId: string,
  //   @GetUser('role') role: string,
  // ) {
  //   const isAdmin = role === 'ADMIN';
  //   if (isAdmin) {
  //     return this.paymentsService.findOne(id);
  //   }
  //   return this.paymentsService.findOneByUser(id, userId);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update payment by ID (Admin only)' })
  // @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  // @ApiResponse({ status: 404, description: 'Payment not found' })
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePaymentDto: UpdatePaymentDto,
  //   @GetUser('role') role: string,
  // ) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }
  //   return this.paymentsService.update(id, updatePaymentDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete payment by ID (Admin only)' })
  // @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  // @ApiResponse({ status: 404, description: 'Payment not found' })
  // remove(@Param('id') id: string, @GetUser('role') role: string) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }
  //   return this.paymentsService.remove(id);
  // }
}
