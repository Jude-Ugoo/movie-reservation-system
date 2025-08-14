import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration_minutes: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rating: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  release_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  poster_url: string;
}
