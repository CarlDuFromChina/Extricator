import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/user.decorator';
import { JdService } from './jd.service';

@Controller('jd')
export class JdController {
  constructor(private jdService: JdService) {}

  @Post('checkin')
  @UseGuards(AuthGuard('jwt'))
  checkin(@AuthUser('code') code: string) {
    return this.jdService.checkin(code);
  }
}
