import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CheckInData } from "./interfaces/checkin-data.interface";
import { UserService } from "src/user/user.service";
import { JdResponse } from "./interfaces/jd-response.interface";

@Injectable()
export class JdService {
  constructor(private httpService: HttpService, private userService: UserService) {}

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
   * 签到
   * @param code 用户编码
   * @returns 
   */
  async checkin(code: string) : Promise<JdResponse<CheckInData>> {
    const config = await this.getConfig(code);
    return this.httpService.post('client.action?functionId=signBeanIndex&appid=ld', null, config).toPromise().then(resp => {
      var result = resp.data as JdResponse<CheckInData>;
      return result;
    });
  }
}