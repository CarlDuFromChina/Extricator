import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @UseGuards(AuthGuard('jwt'))
  update(@Body() userDto: User) {
    return this.userService.updateData(userDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createUserDto: User) {
    return this.userService.createData(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('code') code: string) {
    return this.userService.getData(code);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteData(id);
  }
}
