import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map } from "rxjs";
import { JuejinResponse } from "./interfaces/juejin-response.interface";

@Injectable()
export class JuejinService {
  constructor(private readonly httpService: HttpService) {}

  getCurPoint() {
    return this.httpService.get('growth_api/v1/get_cur_point').pipe(
      map((resp: AxiosResponse) => {
        return resp.data as JuejinResponse<number>;
      })
    )
  }
}