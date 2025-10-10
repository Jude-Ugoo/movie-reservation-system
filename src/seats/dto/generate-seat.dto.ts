import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsEnum, IsArray } from 'class-validator';
import { SeatType } from '@prisma/client';

export class GenerateSeatsDto {
  @ApiProperty({ example: 10, description: 'Number of rows to generate' })
  @IsInt()
  @Min(1)
  @Max(100)
  rows: number;

  @ApiProperty({ example: 10, description: 'Number of columns per row' })
  @IsInt()
  @Min(1)
  @Max(100)
  columns: number;

  @ApiProperty({ example: 'REGULAR', enum: SeatType })
  @IsOptional()
  @IsEnum(SeatType)
  defaultSeatType?: SeatType;

  // Optional custom row labels, e.g. ["A","B","C"]
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  rowLabels?: string[];
}
