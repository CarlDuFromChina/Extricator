import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserReporsitory } from './user.reporsitory';

@Module({
  providers: [UserService, UserReporsitory],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
