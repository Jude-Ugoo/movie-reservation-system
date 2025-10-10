import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateSeatsDto } from './dto/generate-seat.dto';
import { $Enums, Prisma, SeatType } from '@prisma/client';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async create(createSeatDto: CreateSeatDto) {
    const theater = await this.prisma.theater.findUnique({
      where: { theater_id: createSeatDto.theater_id },
    });
    if (!theater) {
      throw new NotFoundException('Theater not found!');
    }

    const exists = await this.prisma.seat.findFirst({
      where: {
        theater_id: createSeatDto.theater_id,
        seat_number: createSeatDto.seat_number,
        row: createSeatDto.row,
      },
    });
    if (exists) {
      throw new BadRequestException(
        'Seat with same theater/row/number already exists',
      );
    }

    try {
      const seat = await this.prisma.seat.create({
        data: createSeatDto,
      });
      return seat;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Duplicate seat for this theater');
      }

      throw error;
    }
  }

  async generateSeats(theater_id: string, dto: GenerateSeatsDto) {
    const theater = await this.prisma.theater.findUnique({
      where: { theater_id },
    });
    if (!theater) {
      throw new NotFoundException(`Theater ${theater_id} not found`);
    }

    const rows =
      dto.rowLabels && dto.rowLabels.length
        ? dto.rowLabels
        : Array.from({ length: dto.rows }, (_, i) => this.numberToLabel(i));
    const columns = dto.columns;
    const defaultSeatType = dto.defaultSeatType ?? SeatType.REGULAR;

    let seatsData: {
      theater_id: string;
      seat_number: string;
      row: string;
      seat_type: $Enums.SeatType;
      is_active: boolean;
    }[] = [];

    for (let r = 0; r < rows.length; r++) {
      const rowLabel = rows[r];
      for (let c = 1; c <= columns; c++) {
        seatsData.push({
          theater_id,
          seat_number: String(c),
          row: rowLabel,
          seat_type: defaultSeatType,
          is_active: true,
        });
      }
    }

    // Use an interactive transaction so both operations succeed or fail together.
    const result = await this.prisma.$transaction(async (tx) => {
      // createMany with skipDuplicates avoids failing on duplicates (useful if run twice)
      const createRes = await tx.seat.createMany({
        data: seatsData,
        skipDuplicates: true,
      });

      // update theater seat_layout and increment total_seats by inserted count
      const inserted = createRes.count ?? 0;
      const newLayout = JSON.stringify({ rows: rows.length, columns });

      await tx.theater.update({
        where: { theater_id },
        data: {
          total_seats: { increment: inserted },
          seat_layout: newLayout,
        },
      });

      return { inserted };
    });

    return {
      message: `Generated seats. inserted: ${result.inserted}`,
      inserted: result.inserted,
    };
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

  // helper to convert a number to row label: 0->A, 25->Z, 26->AA, etc.
  private numberToLabel(n: number) {
    let s = '';
    while (n >= 0) {
      s = String.fromCharCode((n % 26) + 65) + 5;
      n = Math.floor(n / 26) - 1;
    }
    return s;
  }
}
