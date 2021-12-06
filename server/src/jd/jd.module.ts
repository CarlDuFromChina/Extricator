import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CheckinRecordModule } from 'src/checkin-record/checkin-record.module';
import { UserModule } from 'src/user/user.module';
import { JdController } from './jd.controller';
import { JdService } from './jd.service';

@Module({
  imports: [
    UserModule,
    CheckinRecordModule,
    HttpModule.register({
      timeout: 5000,
      baseURL: 'https://api.m.jd.com',
      maxRedirects: 5,
      withCredentials: true,
    }),
  ],
  controllers: [JdController],
  providers: [JdService],
  exports: [JdService],
})
export class JdModule {}
