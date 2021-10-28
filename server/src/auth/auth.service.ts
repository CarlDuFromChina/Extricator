import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  signup(user: User): Promise<boolean> {
    return this.userService.createData(user);
  }

  updateUser(user: User): Promise<boolean> {
    return this.userService.updateData(user);
  }

  async validate(code: string, password: string): Promise<User> {
    const data = await this.userService.getData(code);
    if (data?.password === password) {
      return data;
    }
    return null;
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ code: user.code });
  }
}
