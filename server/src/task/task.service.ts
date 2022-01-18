import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isEmpty, isNil } from 'src/common/assert';
import { EmailService } from 'src/email/email.service';
import { JdService } from 'src/jd/jd.service';
import { JuejinService } from 'src/juejin/juejin.service';
import { UserService } from 'src/user/user.service';
import dayjs from 'dayjs';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private jdService: JdService,
    private juejinService: JuejinService,
    private userService: UserService,
    private emailService: EmailService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async checkin() {
    var users = await this.userService.getAllData();
    for (const user of users) {
      // 掘金
      var data = await this.juejinService.getData(user.code);
      if (data && data.cookie) {
        try {
          await this.juejinService.checkin(user.code); // 签到
          // 签到成功消息通知
          if (!isEmpty(user.email) && data.enable_success_notify && user.mail_verified) {
            var message = 'Hi,<br><br>恭喜你，掘金自动签到成功！';
            await this.emailService.send(message, user.email, '自动签到通知');
          }
        } catch (error) {
          // 签到失败消息通知
          if (!isEmpty(user.email) && data.enable_error_notify && user.mail_verified) {
            var message = 'Hi,<br><br>很抱歉，掘金自动签到失败了';
            await this.emailService.send(message, user.email, '自动签到通知');
          }
          this.logger.error(error);
        }
        
        // 自动使用免费抽奖
        var resp = await this.juejinService.getLotteryConfig(user.code);
        if (resp.free_count > 0) {
          this.juejinService.draw(user.code, 1);
        }
      }

      // 京东
      var data = await this.jdService.getData(user.code);
      if (data && data.cookie) {
        try {
          await this.jdService.checkin(user.code);
          // 签到成功消息通知
          if (!isEmpty(user.email) && data.enable_success_notify && user.mail_verified) {
            var message = 'Hi,<br><br>恭喜你，京东自动签到成功！';
            await this.emailService.send(message, user.email, '自动签到通知');
          }
        } catch (error) {
          // 签到失败消息通知
          if (!isEmpty(user.email) && data.enable_error_notify && user.mail_verified) {
            var message = 'Hi,<br><br>很抱歉，京东自动签到失败了';
            await this.emailService.send(message, user.email, '自动签到通知');
          }
          this.logger.error(error);
        }
      }
    }
  }

  /**
   * Cookie到期通知
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredCookie() {
    var users = await this.userService.getAllData();
    for (const user of users) {
      if (!isEmpty(user.email) && user.mail_verified) {
        // 掘金
        var juejin = await this.juejinService.getData(user.code);
        if (!isNil(juejin) && juejin.enable_cookie_expired_notify && juejin.expired_at) {
          var isExpired = dayjs(juejin.expired_at).subtract(1, 'day').isBefore(dayjs());
          var isNotifiedToday = !isNil(juejin.last_expiration_reminder_time) && dayjs(juejin.last_expiration_reminder_time).isToday(); // 是否今天已经通知过了
          if (isExpired && !isNotifiedToday) {
            var message = 'Hi,<br>您的掘金Cookie还有不到一天就过期了，请尽快更新！';
            await this.emailService.send(message, user.email, 'Cookie过期提醒');
            juejin.last_expiration_reminder_time = new Date();
            await this.juejinService.updateData(juejin, user.code);
          }
        }
        // 京东
        var jd = await this.jdService.getData(user.code);
        if (!isNil(jd) && jd.enable_cookie_expired_notify && jd.expired_at) {
          var isExpired = dayjs(jd.expired_at).subtract(1, 'day').isBefore(dayjs());
          var isNotifiedToday = !isNil(jd.last_expiration_reminder_time) && dayjs(jd.last_expiration_reminder_time).isToday(); // 是否今天已经通知过了
          if (isExpired && !isNotifiedToday) {
            var message = 'Hi,<br><br>您的京东Cookie还有不到一天就过期了，请尽快更新！';
            await this.emailService.send(message, user.email, 'Cookie过期提醒');
            jd.last_expiration_reminder_time = new Date();
            await this.jdService.updateData(jd, user.code);
          }
        }
      }
    }
  }
}
