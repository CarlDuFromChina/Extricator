import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/regsiter.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Request() request) {
    return this.authService.login(request.user);
  }

  @Post('signup')
  signup(@Body() regsiterDto: RegisterDto) {
    return this.authService.signup(regsiterDto);
  }
}
