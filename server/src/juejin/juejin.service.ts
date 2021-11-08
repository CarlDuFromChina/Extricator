import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { CheckinCounts } from "./interfaces/checkin-counts.interface";
import { CheckInData } from "./interfaces/checkin-data.interface";
import { DrawData } from "./interfaces/draw-data.interface";
import { JuejinResponse } from "./interfaces/juejin-response.interface";

@Injectable()
export class JuejinService {
  constructor(private readonly httpService: HttpService, private readonly userService: UserService) {}

  /**
   * 获取掘金请求头
   * @param code 用户编号
   * @returns 
   */
  private async getConfig(code: string) {
    const user = await this.userService.getData(code);
    return {
      withCredentials: true,
      headers: { cookie: user.cookie.juejin }
    };
  }

  private handleReponse<T>(res: JuejinResponse<T>) {
    if (res.err_no.toString() !== '0') {
      throw new InternalServerErrorException(res.err_msg);
    }
    return res.data;
  }

  /**
   * 获取当前剩余矿石
   * @param code 用户编号
   * @returns 
   */
  async getCurPoint(code: string): Promise<number> {
    const config = await this.getConfig(code);
    const res = await this.httpService.get('growth_api/v1/get_cur_point', config).toPromise();
    return this.handleReponse(res.data as JuejinResponse<number>);
  }

  /**
   * 获取当前签到情况
   * @param code 用户编号
   * @returns 
   */
  async getTodayStatus(code: string): Promise<boolean> {
    const config = await this.getConfig(code);
    const res = await this.httpService.get('growth_api/v1/get_today_status', config).toPromise();
    return this.handleReponse(res.data as JuejinResponse<boolean>);
  }

  /**
   * 获取签到总数（连续签到、总签到）
   * @param code 用户编号
   * @returns 
   */
  async getCheckinCounts(code: string) {
    const config = await this.getConfig(code);
    const res = await this.httpService.get('growth_api/v1/get_counts', config).toPromise();
    return this.handleReponse(res.data as JuejinResponse<CheckinCounts>);
  }

  /**
   * 签到
   * @param code 用户编号
   * @returns 
   */
  async checkin(code: string) {
    const config = await this.getConfig(code);
    const result = await this.httpService.post('growth_api/v1/check_in', null, config).toPromise();
    return this.handleReponse(result.data as JuejinResponse<CheckInData>);
  }

  /**
   * 用户抽奖
   * @param code 用户编号
   * @param count 抽奖次数
   * @returns 
   */
  async draw(code: string, count: number): Promise<Array<JuejinResponse<DrawData>>> {
    const promises = [];
    const config = await this.getConfig(code);
    for (let i = 0; i < count; i++) {
      var promise = this.httpService.post('growth_api/v1/lottery/draw', null, config).toPromise().then((resp) => {
        var result = resp.data as JuejinResponse<DrawData>;
        return result;
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  /**
   * 全抽
   * @param code 用户编号
   * @returns 
   */
  async allin(code: string) {
    var curPoint = (await this.getCurPoint(code));
    var count = parseInt((curPoint / 200).toString());
    var result = await this.draw(code, count);
    var prize = {};
    result.forEach(item => {
      if (item.data.lottery_name in prize) {
        prize[item.data.lottery_name] += 1;
      } else {
        prize[item.data.lottery_name] = 1;
      }
    });
    return prize;
  }
}