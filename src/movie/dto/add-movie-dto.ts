import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMovieDto {
  @IsOptional()
  @IsInt()
  tmdbId?: number; // If provided, we'll fetch from TMDb instead

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  duration_minutes?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  rating?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  release_date?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  poster_url?: string;
}
