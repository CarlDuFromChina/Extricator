import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { CookieController } from './cookie.controller';
import { Cookie } from './cookie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cookie])],
  providers: [CookieService],
  controllers: [CookieController]
})
export class CookieModule {}
