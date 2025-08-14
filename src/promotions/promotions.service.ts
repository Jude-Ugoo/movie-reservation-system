import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPromotionDto: CreatePromotionDto) {
    try {
      const promotion = await this.prisma.promotion.create({
        data: createPromotionDto,
      });
      return promotion;
    } catch (error) {
      throw new Error('Failed to create promotion');
    }
  }

  async findAll() {
    try {
      const promotions = await this.prisma.promotion.findMany({
        include: {
          showtime: true,
          reservations: true,
        },
      });
      return promotions;
    } catch (error) {
      throw new Error('Failed to fetch promotions');
    }
  }

  async findOne(id: string) {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { promotion_id: id },
        include: {
          showtime: true,
          reservations: true,
        },
      });

      if (!promotion) {
        throw new NotFoundException('Promotion not found');
      }

      return promotion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch promotion');
    }
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    try {
      const promotion = await this.prisma.promotion.update({
        where: { promotion_id: id },
        data: updatePromotionDto,
      });
      return promotion;
    } catch (error) {
      throw new Error('Failed to update promotion');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.promotion.delete({
        where: { promotion_id: id },
      });
      return { message: 'Promotion deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete promotion');
    }
  }

  async findActivePromotions() {
    try {
      const currentDate = new Date();
      return await this.prisma.promotion.findMany({
        where: {
          is_active: true,
          start_date: {
            lte: currentDate,
          },
          end_date: {
            gte: currentDate,
          },
        },
      });
    } catch (error) {
      throw new Error('Failed to fetch active promotions');
    }
  }
}
