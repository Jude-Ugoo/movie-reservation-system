import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          user_id: true,
          email: true,
          username: true,
          role: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          reservations: true,
        },
      });

      if (!users) {
        return {
          message: 'No user found',
        };
      }

      return users;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id: id },
        select: {
          user_id: true,
          email: true,
          username: true,
          role: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          reservations: {
            select: {
              reservation_id: true,
              status: true,
              total_price: true,
              created_at: true,
              showtime: {
                select: {
                  start_time: true,
                  movie: {
                    select: {
                      title: true,
                      poster_url: true,
                    },
                  },
                  theater: {
                    select: {
                      name: true,
                      location: true,
                    },
                  },
                },
              },
              reservationSeats: {
                select: {
                  seat: {
                    select: {
                      seat_number: true,
                      row: true,
                      seat_type: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async getUserProfile(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id: id },
        select: {
			user_id: true,
			email: true,
			username: true,
			role: true,
			is_active: true,
			created_at: true,
			updated_at: true,
			reservations: {
			  select: {
				reservation_id: true,
				status: true,
				total_price: true,
				created_at: true,
				showtime: {
				  select: {
					start_time: true,
					movie: {
					  select: {
						title: true,
						poster_url: true,
					  },
					},
					theater: {
					  select: {
						name: true,
						location: true,
					  },
					},
				  },
				},
				reservationSeats: {
				  select: {
					seat: {
					  select: {
						seat_number: true,
						row: true,
						seat_type: true,
					  },
					},
				  },
				},
			  },
			},
		  },
      });

      if (!user) {
        throw new NotFoundException('This User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  // async updateUser(id: string, dto: UpdateUserDto) {
  //   try {
  //     const user = await this.prisma.user.findUnique({
  //       where: { user_id: id },
  //     });

  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     const updateData: any = { ...dto };

  //     if (dto.password) {
  //       updateData.password_hash = await bcrypt.hash(dto.password, 10);
  //       delete updateData.password;
  //     }

  //     const updatedUser = await this.prisma.user.update({
  //       where: { user_id: id },
  //       data: updateData,
  //       select: {
  //         user_id: true,
  //         email: true,
  //         username: true,
  //         role: true,
  //         is_active: true,
  //         created_at: true,
  //         updated_at: true,
  //       },
  //     });

  //     return updatedUser;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException('Failed to update user');
  //   }
  // }

  // async deleteUser(id: string) {
  //   try {
  //     const user = await this.prisma.user.findUnique({
  //       where: { user_id: id },
  //     });

  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     await this.prisma.user.delete({
  //       where: { user_id: id },
  //     });

  //     return { message: 'User deleted successfully' };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException('Failed to delete user');
  //   }
  // }
}
