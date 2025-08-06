import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user (Customer || Admin)' })
  @ApiBody({
    description: 'Registration payload',
    schema: {
      example: {
        email: 'john@example.com',
        password: 'securePassword!',
        username: 'John Doe',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        token: 'jwt_token_here',
        id: 'user_12345',
        email: 'john@example.com',
        username: 'John Doe',
      },
    },
  })
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login existing user' })
  @ApiBody({
    description: 'Login payload',
    schema: {
      example: {
        email: 'john@example.com',
        password: 'securePassword!',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    schema: {
      example: {
        token: 'jwt_token_here',
        id: 'user_12345',
        email: 'john@example.com',
        username: 'John Doe',
      },
    },
  })
  async loginUser(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
