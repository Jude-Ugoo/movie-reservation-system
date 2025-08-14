import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    try {
      // Check if showtime exists and is in the future
      const showtime = await this.prisma.showtime.findUnique({
        where: { showtime_id: createReservationDto.showtime_id },
        include: { movie: true, theater: true },
      });

      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }

      if (new Date(showtime.start_time) <= new Date()) {
        throw new BadRequestException('Cannot reserve for past showtimes');
      }

      // Calculate hold expiration (e.g., 15 minutes from now)
      const holdExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Calculate total price (you might want to add seat pricing logic here)
      const totalPrice = createReservationDto.total_price || 0;

      const reservation = await this.prisma.reservation.create({
        data: {
          user_id: userId,
          showtime_id: createReservationDto.showtime_id,
          status: ReservationStatus.HELD,
          hold_expires_at: holdExpiresAt,
          total_price: totalPrice,
          group_booking: createReservationDto.group_booking || false,
          promotion_id: createReservationDto.promotion_id,
        },
        include: {
          user: true,
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
        },
      });

      return reservation;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create reservation');
    }
  }

  async findAll() {
    try {
      const reservations = await this.prisma.reservation.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              email: true,
              username: true,
            },
          },
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
          reservationSeats: {
            include: {
              seat: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return reservations;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch reservations');
    }
  }

  async findByUser(userId: string) {
    try {
      const reservations = await this.prisma.reservation.findMany({
        where: { user_id: userId },
        include: {
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
          reservationSeats: {
            include: {
              seat: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return reservations;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch user reservations',
      );
    }
  }

  async findOne(id: string) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { reservation_id: id },
        include: {
          user: {
            select: {
              user_id: true,
              email: true,
              username: true,
            },
          },
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
          reservationSeats: {
            include: {
              seat: true,
            },
          },
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch reservation');
    }
  }

  async findOneByUser(id: string, userId: string) {
    try {
      const reservation = await this.prisma.reservation.findFirst({
        where: {
          reservation_id: id,
          user_id: userId,
        },
        include: {
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
          reservationSeats: {
            include: {
              seat: true,
            },
          },
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch reservation');
    }
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { reservation_id: id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const updatedReservation = await this.prisma.reservation.update({
        where: { reservation_id: id },
        data: updateReservationDto,
        include: {
          user: {
            select: {
              user_id: true,
              email: true,
              username: true,
            },
          },
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
        },
      });

      return updatedReservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update reservation');
    }
  }

  async updateByUser(
    id: string,
    updateReservationDto: UpdateReservationDto,
    userId: string,
  ) {
    try {
      const reservation = await this.prisma.reservation.findFirst({
        where: {
          reservation_id: id,
          user_id: userId,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      // Users can only update certain fields
      const allowedUpdates = {
        status: updateReservationDto.status,
        group_booking: updateReservationDto.group_booking,
      };

      const updatedReservation = await this.prisma.reservation.update({
        where: { reservation_id: id },
        data: allowedUpdates,
        include: {
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
          promotion: true,
        },
      });

      return updatedReservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update reservation');
    }
  }

  async remove(id: string) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { reservation_id: id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      await this.prisma.reservation.delete({
        where: { reservation_id: id },
      });

      return { message: 'Reservation deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete reservation');
    }
  }

  async cancelByUser(id: string, userId: string) {
    try {
      const reservation = await this.prisma.reservation.findFirst({
        where: {
          reservation_id: id,
          user_id: userId,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('Reservation is already cancelled');
      }

      const updatedReservation = await this.prisma.reservation.update({
        where: { reservation_id: id },
        data: { status: ReservationStatus.CANCELLED },
        include: {
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
        },
      });

      return {
        message: 'Reservation cancelled successfully',
        reservation: updatedReservation,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to cancel reservation');
    }
  }

  async confirmReservation(id: string) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { reservation_id: id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.HELD) {
        throw new BadRequestException('Reservation is not in held status');
      }

      const updatedReservation = await this.prisma.reservation.update({
        where: { reservation_id: id },
        data: { status: ReservationStatus.CONFIRMED },
        include: {
          user: true,
          showtime: {
            include: {
              movie: true,
              theater: true,
            },
          },
        },
      });

      return updatedReservation;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to confirm reservation');
    }
  }
}
