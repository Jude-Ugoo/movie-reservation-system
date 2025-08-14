import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async create(createSeatDto: CreateSeatDto) {
    try {
      const seat = await this.prisma.seat.create({
        data: createSeatDto,
      });
      return seat;
    } catch (error) {
      throw new Error('Failed to create seat');
    }
  }

  async findAll() {
    try {
      const seats = await this.prisma.seat.findMany({
        include: {
          theater: true,
          reservationSeats: true,
        },
      });
      return seats;
    } catch (error) {
      throw new Error('Failed to fetch seats');
    }
  }

  async findOne(id: string) {
    try {
      const seat = await this.prisma.seat.findUnique({
        where: { seat_id: id },
        include: {
          theater: true,
          reservationSeats: true,
        },
      });

      if (!seat) {
        throw new NotFoundException('Seat not found');
      }

      return seat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch seat');
    }
  }

  async update(id: string, updateSeatDto: UpdateSeatDto) {
    try {
      const seat = await this.prisma.seat.update({
        where: { seat_id: id },
        data: updateSeatDto,
      });
      return seat;
    } catch (error) {
      throw new Error('Failed to update seat');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.seat.delete({
        where: { seat_id: id },
      });
      return { message: 'Seat deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete seat');
    }
  }

  async findByTheater(theaterId: string) {
    try {
      return await this.prisma.seat.findMany({
        where: {
          theater_id: theaterId,
          is_active: true,
        },
        orderBy: [{ row: 'asc' }, { seat_number: 'asc' }],
      });
    } catch (error) {
      throw new Error('Failed to fetch theater seats');
    }
  }
}
