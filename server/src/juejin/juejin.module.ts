/* juejin.module.ts */

import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JuejinController } from "./juejin.controller";
import { JuejinService } from "./juejin.service";

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    baseURL: 'https://api.juejin.cn/',
    maxRedirects: 5
  })],
  controllers: [JuejinController],
  providers: [JuejinService],
  exports: [JuejinService]
})

export class JuejinModule {}