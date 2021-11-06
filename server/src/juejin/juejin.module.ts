/* juejin.module.ts */

import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { JuejinController } from "./juejin.controller";
import { JuejinService } from "./juejin.service";

@Module({
  imports: [UserModule,
  HttpModule.register({
    timeout: 5000,
    baseURL: 'https://api.juejin.cn/',
    maxRedirects: 5,
    withCredentials: true
  })],
  controllers: [JuejinController],
  providers: [JuejinService],
  exports: [JuejinService]
})

export class JuejinModule {}