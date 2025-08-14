import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    try {
      const showtime = await this.prisma.showtime.create({
        data: createShowtimeDto,
        include: {
          movie: true,
          theater: true,
          promotion: true,
        },
      });
      return showtime;
    } catch (error) {
      throw new Error('Failed to create showtime');
    }
  }

  async findAll() {
    try {
      const showtimes = await this.prisma.showtime.findMany({
        include: {
          movie: true,
          theater: true,
          promotion: true,
          reservations: true,
        },
      });
      return showtimes;
    } catch (error) {
      throw new Error('Failed to fetch showtimes');
    }
  }

  async findOne(id: string) {
    try {
      const showtime = await this.prisma.showtime.findUnique({
        where: { showtime_id: id },
        include: {
          movie: true,
          theater: true,
          promotion: true,
          reservations: true,
        },
      });

      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }

      return showtime;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch showtime');
    }
  }

  async update(id: string, updateShowtimeDto: UpdateShowtimeDto) {
    try {
      const showtime = await this.prisma.showtime.update({
        where: { showtime_id: id },
        data: updateShowtimeDto,
      });
      return showtime;
    } catch (error) {
      throw new Error('Failed to update showtime');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.showtime.delete({
        where: { showtime_id: id },
      });
      return { message: 'Showtime deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete showtime');
    }
  }

  async findUpcomingShowtimes() {
    try {
      const currentDate = new Date();
      return await this.prisma.showtime.findMany({
        where: {
          start_time: {
            gte: currentDate,
          },
        },
        include: {
          movie: true,
          theater: true,
          promotion: true,
        },
        orderBy: {
          start_time: 'asc',
        },
      });
    } catch (error) {
      throw new Error('Failed to fetch upcoming showtimes');
    }
  }

  async findShowtimesByMovie(movieId: string) {
    try {
      return await this.prisma.showtime.findMany({
        where: {
          movie_id: movieId,
          start_time: {
            gte: new Date(),
          },
        },
        include: {
          theater: true,
          promotion: true,
        },
        orderBy: {
          start_time: 'asc',
        },
      });
    } catch (error) {
      throw new Error('Failed to fetch movie showtimes');
    }
  }
}
