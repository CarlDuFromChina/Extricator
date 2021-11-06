/* juejin.controller.ts */

import { Controller, Get, InternalServerErrorException, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/user/user.decorator";
import { JuejinService } from "./juejin.service";
import { Request } from 'express';
import { count } from "rxjs";

@Controller('juejin')
@UseGuards(AuthGuard('jwt'))
export class JuejinController {
  constructor(private juejinService: JuejinService) {}

  @Get('getCurPoint')
  @UseGuards(AuthGuard('jwt'))
  getCurPoint(@AuthUser('code') code: string) {
    return this.juejinService.getCurPoint(code);
  }

  @Get('getTodayStatus')
  @UseGuards(AuthGuard('jwt'))
  getTodayStatus(@AuthUser('code') code: string) {
    return this.juejinService.getTodayStatus(code);
  }

  @Get('getCheckinCounts')
  @UseGuards(AuthGuard('jwt'))
  getCheckinCounts(@AuthUser('code') code: string) {
    return this.juejinService.getCheckinCounts(code);
  }

  @Post('checkin')
  @UseGuards(AuthGuard('jwt'))
  checkin(@AuthUser('code') code: string) {
    return this.juejinService.checkin(code);
  }

  @Post(':count')
  @UseGuards(AuthGuard('jwt'))
  async draw(@AuthUser('code') code: string, @Query('count') count: number) {
    const resp = await this.juejinService.draw(code, count);
    var result = [];
    resp.forEach(item => {
      if (item.err_no === 0) {
        result.push(`恭喜获得${item.data.lottery_name}`);
      } else {
        throw new InternalServerErrorException(item.err_msg);
      }
    });
    return result;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async allin(@AuthUser('code') code: string) {
    const resp = await this.juejinService.allin(code);
    if (Object.keys(resp).length === 0) {
      throw new InternalServerErrorException('你没有矿石了');
    } else {
      var result = '共计<br/>';
      for (const key in resp) {
        if (Object.prototype.hasOwnProperty.call(resp, key)) {
          const element = resp[key];
          result += `${key}：${element}<br/>`;
        }
      }
      return result;
    }
  }
}