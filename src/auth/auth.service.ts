import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDto } from './dto';

import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const passwordStr = String(dto.password);
    const password = await argon2.hash(passwordStr);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password_hash: password,
          role: dto.role,
        },
      });

      return {
        message: 'User registered successfully',
        token: await this.signToken(newUser.user_id, newUser.email),
        newUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new ForbiddenException('User Not Found!');
      }
      const passwordStr = String(dto.password);
      const passwordMatches = await argon2.verify(
        user.password_hash,
        passwordStr,
      );
      if (!passwordMatches) {
        throw new ForbiddenException('Invalid Credentials!');
      }

      return {
        message: 'Login successful',
        token: await this.signToken(user.user_id, user.email),
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('ACCESS_TOKEN');

    const token = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: '1h',
    });

    return token;
  }
}
