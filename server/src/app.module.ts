import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JdModule } from './jd/jd.module';
import { JuejinModule } from './juejin/juejin.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';

@Module({
  imports: [JdModule, JuejinModule, AuthModule, UserModule, ScheduleModule.forRoot(), TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
