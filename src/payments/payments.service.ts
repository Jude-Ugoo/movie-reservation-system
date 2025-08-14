import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.prisma.payment.create({
        data: createPaymentDto,
      });
      return payment;
    } catch (error) {
      throw new Error('Failed to create payment');
    }
  }

  async findAll() {
    try {
      const payments = await this.prisma.payment.findMany({
        include: {
          user: true,
          reservation: true,
        },
      });
      return payments;
    } catch (error) {
      throw new Error('Failed to fetch payments');
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { payment_id: id },
        include: {
          user: true,
          reservation: true,
        },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch payment');
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.prisma.payment.update({
        where: { payment_id: id },
        data: updatePaymentDto,
      });
      return payment;
    } catch (error) {
      throw new Error('Failed to update payment');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.payment.delete({
        where: { payment_id: id },
      });
      return { message: 'Payment deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete payment');
    }
  }
}
