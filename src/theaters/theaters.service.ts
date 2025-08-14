import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Injectable()
export class TheatersService {
  constructor(private prisma: PrismaService) {}

  async addTheater(data: CreateTheaterDto) {
    try {
      const theater = await this.prisma.theater.create({
        data,
      });
      return theater;
    } catch (error) {
      throw new Error('Failed to create theater');
    }
  }

  async getAllTheaters() {
    try {
      const theaters = await this.prisma.theater.findMany();
      return theaters;
    } catch (error) {
      throw new Error('Failed to fetch theaters');
    }
  }

  async getTheaterById(id: string) {
    try {
      const theater = await this.prisma.theater.findUnique({
        where: { theater_id: id },
      });

      if (!theater) {
        throw new NotFoundException('Theater not found');
      }

      return theater;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving movies.',
      );
    }
  }

  async updateTheater(id: string, data: UpdateTheaterDto) {
    try {
      const updateTheater = await this.prisma.theater.findUnique({
        where: { theater_id: id },
      });

      if (!updateTheater) {
        throw new NotFoundException('Theater not found!');
      }

      return await this.prisma.theater.update({
        where: { theater_id: id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the theater.',
      );
    }
  }

  async deleteTheater(id: string) {
    try {
      const theater = await this.prisma.theater.findUnique({
        where: { theater_id: id },
      });

      if (!theater) {
        throw new NotFoundException('Theater not found');
      }

      await this.prisma.theater.delete({
        where: { theater_id: id },
      });

      return { message: 'Theater deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the theater.',
      );
    }
  }
}
