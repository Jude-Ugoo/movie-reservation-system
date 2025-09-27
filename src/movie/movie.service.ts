import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	Logger,
	BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMovieDto } from './dto/add-movie-dto';
import { UpdateMovieDto } from './dto/update-movie-dto';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MovieService {
	private readonly logger = new Logger(MovieService.name);
	private readonly BASE_URL = 'https://api.themoviedb.org/3';

	constructor(
		private prisma: PrismaService,
		private readonly httpService: HttpService,
		private config: ConfigService,
	) {
		this.logger.log('MovieService initialized');
	}

	async addMovie(dto: AddMovieDto) {
		this.logger.log(`Attempting to add new movie: ${dto.title}`);

		if (dto.tmdbId) {
			return this.addFromTmdb(dto.tmdbId);
		}

		return this.createManual(dto);
	}

	async getMovies() {
		this.logger.log('Fetching all movies');
		try {
			const movies = await this.prisma.movie.findMany({
				orderBy: { created_at: 'desc' },
			});

			if (!movies) {
				this.logger.warn('No movies found in the database');
				throw new NotFoundException('Movies not found!');
			}

			this.logger.log(`Successfully retrieved ${movies.length} movies`);
			return movies;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error('Failed to retrieve movies', error.stack);
			throw new InternalServerErrorException(
				'An unexpected error occurred while retrieving movies.',
			);
		}
	}

	async getMovieById(movieId: string) {
		this.logger.log(`Fetching movie with ID: ${movieId}`);
		try {
			const movie = await this.prisma.movie.findUnique({
				where: { movie_id: movieId },
			});

			if (!movie) {
				this.logger.warn(`Movie with ID ${movieId} not found`);
				throw new NotFoundException('Movie not found!');
			}

			this.logger.log(`Successfully retrieved movie: ${movie.title}`);
			return movie;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error(
				`Failed to retrieve movie with ID ${movieId}`,
				error.stack,
			);
			throw new InternalServerErrorException(
				'An unexpected error occurred while retrieving the movie.',
			);
		}
	}

	async update(movieId: string, dto: UpdateMovieDto) {
		this.logger.log(`Attempting to update movie with ID: ${movieId}`);
		try {
			const updatedMovie = await this.prisma.movie.findUnique({
				where: { movie_id: movieId },
			});
			if (!updatedMovie) {
				this.logger.warn(`Movie with ID ${movieId} not found for update`);
				throw new NotFoundException('Movie not found!');
			}

			const result = await this.prisma.movie.update({
				where: { movie_id: movieId },
				data: dto,
			});

			this.logger.log(`Successfully updated movie: ${result.title}`);
			return result;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error(
				`Failed to update movie with ID ${movieId}`,
				error.stack,
			);
			throw new InternalServerErrorException(
				'An unexpected error occurred while updating the movie.',
			);
		}
	}

	async delete(movieId: string) {
		this.logger.log(`Attempting to delete movie with ID: ${movieId}`);
		try {
			const movieToDelete = await this.prisma.movie.findUnique({
				where: { movie_id: movieId },
			});
			if (!movieToDelete) {
				this.logger.warn(`Movie with ID ${movieId} not found for deletion`);
				throw new NotFoundException('Movie not found!');
			}

			await this.prisma.movie.delete({
				where: { movie_id: movieId },
			});

			this.logger.log(`Successfully deleted movie: ${movieToDelete.title}`);
			return 'Movie has been removed successfully!';
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error(
				`Failed to delete movie with ID ${movieId}`,
				error.stack,
			);
			throw new InternalServerErrorException(
				'An unexpected error occurred while deleting the movie.',
			);
		}
	}

	async getTmdbMovies(): Promise<any> {
		this.logger.log('Fetching movies from TMDB API');
		const access_key = this.config.get<string>('TMDB_API_READ_ACCESS_TOKEN');

		if (!access_key) {
			this.logger.error('TMDB API key not found in configuration');
			throw new InternalServerErrorException('API configuration error');
		}

		try {
			this.logger.debug('Making request to TMDB API');
			const response = await firstValueFrom(
				this.httpService
					.get(
						`${this.BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
						{
							headers: {
								Authorization: `Bearer ${access_key}`,
							},
						},
					)
					.pipe(map((response) => response.data)),
			);

			this.logger.log('Successfully fetched TMDB movies');
			return response;
		} catch (error) {
			this.logger.error('Failed to fetch TMDB movies', error.stack);
			throw new InternalServerErrorException(
				'An unexpected error occurred while fetching movies from TMDB.',
			);
		}
	}

	private async checkExistingMovie(title: string, releaseDate?: Date) {
		const existingMovie = await this.prisma.movie.findFirst({
			where: {
				OR: [
					{ title: { equals: title, mode: 'insensitive' } },
					{
						AND: [
							{ title: { contains: title, mode: 'insensitive' } },
							{ release_date: releaseDate },
						],
					},
				],
			},
		});

		if (existingMovie) {
			this.logger.warn(`Movie "${title}" already exists in the database`);
			throw new BadRequestException(
				`Movie "${title}" already exists in the database. Movie ID: ${existingMovie.movie_id}`,
			);
		}
	}

	private async createManual(dto: AddMovieDto) {
		if (!dto.title || !dto.duration_minutes) {
			throw new BadRequestException(
				'Title and duration are required for manual entry.',
			);
		}

		// Check for existing movie before creation
		const releaseDate = dto.release_date
			? new Date(dto.release_date)
			: new Date();
		await this.checkExistingMovie(dto.title, releaseDate);

		const newMovie = this.prisma.movie.create({
			data: {
				title: dto.title,
				description: dto.description || '',
				duration_minutes: dto.duration_minutes,
				rating: dto.rating || 'NR',
				release_date: dto.release_date
					? new Date(dto.release_date)
					: new Date(),
				language: dto.language || 'Unknown',
				genre: dto.genre || '',
				poster_url: dto.poster_url || '',
			},
		});

		this.logger.log(`Successfully added new movie: ${dto.title}`);

		return newMovie;
	}

	private async addFromTmdb(tmdbId: number) {
		const apiKey = this.config.get<string>('TMDB_API_KEY');

		const { data } = await firstValueFrom(
			this.httpService.get(
				`${this.BASE_URL}/movie/${tmdbId}?api_key=${apiKey}&append_to_response=videos`,
			),
		);

		if (!data?.title) {
			this.logger.error('Movie not found on TMDB');
			throw new NotFoundException('Movie not found on TMDB');
		}

		// Check for existing movie before creation
		const releaseDate = data.release_date
			? new Date(data.release_date)
			: new Date();
		await this.checkExistingMovie(data.title, releaseDate);

		return this.prisma.movie.create({
			data: {
				title: data.title,
				description: data.overview || '',
				duration_minutes: data.runtime || 0,
				rating: data.vote_average ? `${data.vote_average}/10` : 'NR',
				release_date: data.release_date
					? new Date(data.release_date)
					: new Date(),
				language: data.original_language || 'Unknown',
				genre: data.genres?.map((g) => g.name).join(', ') || '',
				poster_url: data.poster_path
					? `https://image.tmdb.org/t/p/w500${data.poster_path}`
					: '',
			},
		});
	}
}
