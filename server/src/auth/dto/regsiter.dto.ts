import { Cookie } from "src/cookie/cookie.entity";

export class RegisterDto {
  code: string;
  password: string;
  cookie: Cookie
}