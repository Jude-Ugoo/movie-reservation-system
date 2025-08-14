import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateReservationSeatDto } from './dto/create-reservation-seat.dto';
import { UpdateReservationSeatDto } from './dto/update-reservation-seat.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationSeatsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReservationSeatDto: CreateReservationSeatDto,
    userId: string,
  ) {
    try {
      // Check if reservation exists and belongs to the user
      const reservation = await this.prisma.reservation.findFirst({
        where: {
          reservation_id: createReservationSeatDto.reservation_id,
          user_id: userId,
        },
      });

      if (!reservation) {
        throw new NotFoundException(
          'Reservation not found or does not belong to user',
        );
      }

      // Check if seat exists and is available
      const seat = await this.prisma.seat.findUnique({
        where: { seat_id: createReservationSeatDto.seat_id },
      });

      if (!seat) {
        throw new NotFoundException('Seat not found');
      }

      if (!seat.is_active) {
        throw new BadRequestException('Seat is not available');
      }

      // Check if seat is already reserved for this showtime
      const existingReservation = await this.prisma.reservationSeat.findFirst({
        where: {
          seat_id: createReservationSeatDto.seat_id,
          reservation: {
            showtime_id: reservation.showtime_id,
            status: {
              in: [ReservationStatus.HELD, ReservationStatus.CONFIRMED],
            },
          },
        },
      });

      if (existingReservation) {
        throw new BadRequestException(
          'Seat is already reserved for this showtime',
        );
      }

      const reservationSeat = await this.prisma.reservationSeat.create({
        data: {
          reservation_id: createReservationSeatDto.reservation_id,
          seat_id: createReservationSeatDto.seat_id,
          price: createReservationSeatDto.price,
          showtime_id: reservation.showtime_id,
          status: ReservationStatus.HELD, // Default to HELD status for new reservations
        },
        include: {
          reservation: {
            include: {
              user: true,
              showtime: {
                include: {
                  movie: true,
                  theater: true,
                },
              },
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
      });

      return reservationSeat;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create reservation seat',
      );
    }
  }

  async findAll() {
    try {
      const reservationSeats = await this.prisma.reservationSeat.findMany({
        include: {
          reservation: {
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
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
        orderBy: {
          reservation: {
            created_at: 'desc',
          },
        },
      });

      return reservationSeats;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch reservation seats',
      );
    }
  }

  async findByUser(userId: string) {
    try {
      const reservationSeats = await this.prisma.reservationSeat.findMany({
        where: {
          reservation: {
            user_id: userId,
          },
        },
        include: {
          reservation: {
            include: {
              showtime: {
                include: {
                  movie: true,
                  theater: true,
                },
              },
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
        orderBy: {
          reservation: {
            created_at: 'desc',
          },
        },
      });

      return reservationSeats;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch user reservation seats',
      );
    }
  }

  async findOne(id: string) {
    try {
      const reservationSeat = await this.prisma.reservationSeat.findUnique({
        where: { reservationSeat_id: id },
        include: {
          reservation: {
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
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
      });

      if (!reservationSeat) {
        throw new NotFoundException('Reservation seat not found');
      }

      return reservationSeat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch reservation seat',
      );
    }
  }

  async findOneByUser(id: string, userId: string) {
    try {
      const reservationSeat = await this.prisma.reservationSeat.findFirst({
        where: {
          reservationSeat_id: id,
          reservation: {
            user_id: userId,
          },
        },
        include: {
          reservation: {
            include: {
              showtime: {
                include: {
                  movie: true,
                  theater: true,
                },
              },
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
      });

      if (!reservationSeat) {
        throw new NotFoundException('Reservation seat not found');
      }

      return reservationSeat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch reservation seat',
      );
    }
  }

  async update(id: string, updateReservationSeatDto: UpdateReservationSeatDto) {
    try {
      const reservationSeat = await this.prisma.reservationSeat.findUnique({
        where: { reservationSeat_id: id },
      });

      if (!reservationSeat) {
        throw new NotFoundException('Reservation seat not found');
      }

      const updatedReservationSeat = await this.prisma.reservationSeat.update({
        where: { reservationSeat_id: id },
        data: updateReservationSeatDto,
        include: {
          reservation: {
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
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
      });

      return updatedReservationSeat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update reservation seat',
      );
    }
  }

  async updateByUser(
    id: string,
    updateReservationSeatDto: UpdateReservationSeatDto,
    userId: string,
  ) {
    try {
      const reservationSeat = await this.prisma.reservationSeat.findFirst({
        where: {
          reservationSeat_id: id,
          reservation: {
            user_id: userId,
          },
        },
      });

      if (!reservationSeat) {
        throw new NotFoundException('Reservation seat not found');
      }

      // Users can only update certain fields
      const allowedUpdates = {
        status: updateReservationSeatDto.status,
        price: updateReservationSeatDto.price,
      };

      const updatedReservationSeat = await this.prisma.reservationSeat.update({
        where: { reservationSeat_id: id },
        data: allowedUpdates,
        include: {
          reservation: {
            include: {
              showtime: {
                include: {
                  movie: true,
                  theater: true,
                },
              },
            },
          },
          seat: {
            include: {
              theater: true,
            },
          },
        },
      });

      return updatedReservationSeat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update reservation seat',
      );
    }
  }

  async remove(id: string) {
    try {
      const reservationSeat = await this.prisma.reservationSeat.findUnique({
        where: { reservationSeat_id: id },
      });

      if (!reservationSeat) {
        throw new NotFoundException('Reservation seat not found');
      }

      await this.prisma.reservationSeat.delete({
        where: { reservationSeat_id: id },
      });

      return { message: 'Reservation seat removed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to remove reservation seat',
      );
    }
  }

  async removeByUser(id: string, userId: string) {
    try {
      const reservationSeat = await this.prisma.reservationSeat.findFirst({
        where: {
          reservationSeat_id: id,
          reservation: {
            user_id: userId,
          },
        },
      });

      if (!reservationSeat) {
        throw new NotFoundException('Reservation seat not found');
      }

      await this.prisma.reservationSeat.delete({
        where: { reservationSeat_id: id },
      });

      return { message: 'Reservation seat removed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to remove reservation seat',
      );
    }
  }

  async getAvailableSeats(showtimeId: string) {
    try {
      const showtime = await this.prisma.showtime.findUnique({
        where: { showtime_id: showtimeId },
        include: {
          theater: true,
        },
      });

      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }

      // Get all seats for the theater
      const allSeats = await this.prisma.seat.findMany({
        where: {
          theater_id: showtime.theater_id,
          is_active: true,
        },
      });

      // Get reserved seats for this showtime
      const reservedSeats = await this.prisma.reservationSeat.findMany({
        where: {
          reservation: {
            showtime_id: showtimeId,
            status: {
              in: [ReservationStatus.HELD, ReservationStatus.CONFIRMED],
            },
          },
        },
        select: {
          seat_id: true,
        },
      });

      const reservedSeatIds = reservedSeats.map((rs) => rs.seat_id);
      const availableSeats = allSeats.filter(
        (seat) => !reservedSeatIds.includes(seat.seat_id),
      );

      return availableSeats;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch available seats');
    }
  }
}
