import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CheckInData } from "./interfaces/checkin-data.interface";
import { UserService } from "src/user/user.service";
import { JdResponse } from "./interfaces/jd-response.interface";
import { CheckinRecord } from "src/checkin-record/checkin-record.entity";
import { CheckinRecordService } from "src/checkin-record/checkin-record.service";

@Injectable()
export class JdService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private readonly checkinRecordService: CheckinRecordService
  ) {}

  /**
   * 获取京东请求头
   * @param code 用户编号
   * @returns 
   */
   private async getConfig(code: string) {
    const user = await this.userService.getData(code);
    return {
      withCredentials: true,
      headers: { cookie: user.cookie.jd }
    };
  }

  /**
   * 获取今日签到状态
   * @param code 用户编号
   * @returns 
   */
  async getTodayStatus(code: string) {
    var data = await this.checkinRecordService.getTodayData(code, 'jd');
    if (data && data.status) {
      return true;
    }
    return false;
  }

  /**
   * 签到
   * @param code 用户编码
   * @returns 
   */
  async checkin(code: string) : Promise<JdResponse<CheckInData>> {
    const config = await this.getConfig(code);
    var resp = await this.httpService.post('client.action?functionId=signBeanIndex&appid=ld', null, config).toPromise();
    var result = resp.data as JdResponse<CheckInData>;
    var jdRecord = new CheckinRecord();
    jdRecord.created_at = new Date();
    jdRecord.platform = 'jd';
    jdRecord.platform_name = '京东';
    jdRecord.user_code = code;
    jdRecord.status = result.code === '0';
    jdRecord.error_reason = result.errorMessage;
    this.checkinRecordService.createOrUpdateData(jdRecord);
    return result;
  }
}