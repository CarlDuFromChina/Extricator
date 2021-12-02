import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { CheckinRecord } from 'src/checkin-record/checkin-record.entity';
import { CheckinRecordService } from 'src/checkin-record/checkin-record.service';
import { JdService } from 'src/jd/jd.service';
import { JuejinService } from 'src/juejin/juejin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private jdService: JdService,
    private juejinService: JuejinService,
    private userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCheckin() {
    this.logger.debug('自动签到');
    this.userService.getAllData().then((users) => {
      users.forEach((user) => {
        if (user.cookie.juejin) {
          // 签到
          this.juejinService.checkin(user.code);
          // 免费抽奖
          this.juejinService.getLotteryConfig(user.code).then(resp => {
            if (resp.free_count > 0) {
              this.juejinService.draw(user.code, 1);
            }
          })
        }
        if (user.cookie.jd) {
          this.jdService.checkin(user.code);          
        }
      });
    });
  }
}
