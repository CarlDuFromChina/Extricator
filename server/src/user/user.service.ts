import { HttpException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserReporsitory } from './user.reporsitory';

@Injectable()
export class UserService {
  constructor(private readonly reporsitory: UserReporsitory) {}

  async getData(code: string): Promise<User> {
    var result = await this.reporsitory.getData(code);
    return result;
  }

  async getAllData(): Promise<Array<User>> {
    var result = await this.reporsitory.getAllData();
    return result;
  }

  async createData(user: User): Promise<boolean> {
    if (!user.code || !user.password) {
      throw new HttpException('注册失败', 500);
    }
    var data = await this.reporsitory.getData(user.code);
    if (data) {
      throw new HttpException('注册失败，用户已被注册', 500);
    }
    const result = await this.reporsitory.writeData(user);
    return result;
  }

  async updateData(user: User): Promise<boolean> {
    if (!user.code || !user.password) {
      throw new HttpException('更新失败，用户编号和密码不能为空', 500);
    }
    var data = await this.reporsitory.getData(user.code);
    if (!data) {
      throw new HttpException('更新失败，用户不存在', 500);
    }
    const result = await this.reporsitory.updateData(user);
    return result;
  }

  async deleteData(code: string): Promise<boolean> {
    if (!code) {
      return false;
    }
    var data = await this.reporsitory.getData(code);
    if (!data) {
      throw new HttpException('删除失败，用户不存在', 500);
    }
    var result = await this.reporsitory.deleteData(code);
    return result;
  }
}
