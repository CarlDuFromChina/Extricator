import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { JdService } from 'src/jd/jd.service';
import { JuejinService } from 'src/juejin/juejin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private jdService: JdService, private juejinService: JuejinService, private userService: UserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCheckin() {
    this.logger.debug('自动签到');
    this.userService.getAllData().then(users => {
      users.forEach(user => {
        this.jdService.checkin(user.code);
        this.juejinService.checkin(user.code);
      });
    });
  }
}