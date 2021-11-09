import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cookie } from './cookie.entity';
import { CookieService } from './cookie.service';

@Controller('cookie')
@UseGuards(AuthGuard('jwt'))
export class CookieController {
  constructor(private cookieService: CookieService) {}

  @Put()
  update(@Body() userDto: Cookie) {
    return this.cookieService.updateData(userDto);
  }

  @Post()
  create(@Body() createUserDto: Cookie) {
    this.cookieService.createData(createUserDto);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.cookieService.getData(code);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cookieService.deleteData(id);
  }
}
