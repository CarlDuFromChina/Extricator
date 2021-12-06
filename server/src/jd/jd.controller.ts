import { Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { AuthUser } from 'src/user/user.decorator';
import { JdService } from './jd.service';

@Controller('jd')
@UseGuards(AuthGuard('jwt'))
@UseFilters(new HttpExceptionFilter())
export class JdController {
  constructor(private jdService: JdService) {}

  @Get('getTodayStatus')
  getTodayStatus(@AuthUser('code') code: string) {
    return this.jdService.getTodayStatus(code);
  }
  
  @Post('checkin')
  checkin(@AuthUser('code') code: string) {
    return this.jdService.checkin(code);
  }
}
