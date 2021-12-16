import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { JdModule } from 'src/jd/jd.module';
import { JuejinModule } from 'src/juejin/juejin.module';
import { UserModule } from 'src/user/user.module';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [JdModule, JuejinModule, UserModule, EmailModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}