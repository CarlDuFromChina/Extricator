import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JdModule } from './jd/jd.module';
import { JuejinModule } from './juejin/juejin.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieModule } from './cookie/cookie.module';

@Module({
  imports: [
    JdModule,
    JuejinModule,
    AuthModule,
    UserModule,
    ScheduleModule.forRoot(),
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123123',
      database: 'extrictor',
      synchronize: true,
      autoLoadEntities: true
    }),
    CookieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
