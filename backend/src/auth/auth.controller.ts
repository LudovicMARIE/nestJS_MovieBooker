import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'StrongPass123',
      },
    },
  })
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'StrongPass123',
      },
    },
  })
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}

