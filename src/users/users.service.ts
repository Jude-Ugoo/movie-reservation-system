import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../auth/dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany();

      if (!users) {
        return {
          message: 'No user found',
        };
      }

      return users;
    } catch (error) {
      throw error;
    }
  }
}
