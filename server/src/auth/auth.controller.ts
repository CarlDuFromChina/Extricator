import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/regsiter.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Request() request) {
    return this.authService.login(request.user);
  }

  @Post('signup')
  signup(@Body() regsiterDto: RegisterDto) {
    var user = regsiterDto as User;
    return this.authService.signup(user);
  }
}
