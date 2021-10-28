/* juejin.controller.ts */

import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JuejinService } from "./juejin.service";

@Controller('juejin')
@UseGuards(AuthGuard('jwt'))
export class JuejinController {
  constructor(private juejinService: JuejinService) {}

  @Get('getCurPoint')
  getCurPoint() {
    return this.juejinService.getCurPoint();
  }
}