import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CookieModule } from 'src/cookie/cookie.module';
import { Cookie } from 'src/cookie/cookie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cookie]), CookieModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
