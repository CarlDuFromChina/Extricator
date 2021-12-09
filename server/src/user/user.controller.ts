import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('data')
  getData(@AuthUser('code') code: string) {
    return this.userService.getData(code);
  }
  
  @Put('data')
  update(@Body() userDto: User) {
    this.userService.updateData(userDto);
  }

  @Post('data')
  create(@Body() createUserDto: User) {
    this.userService.createData(createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteData(id);
  }
}
