import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('data')
  @UseGuards(AuthGuard('jwt'))
  data(@Body() userDto: User) {
    return this.userService.updateData(userDto);
  }
}
