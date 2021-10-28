import { User } from "src/user/user.entity";

export class RegisterDto implements User{
  code: string;
  password: string;
  cookie: { jd: string; juejin: string; };
}