import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cookie } from './cookie.entity';

@Injectable()
export class CookieService {
  constructor(
    @InjectRepository(Cookie)
    private cookiesRepository: Repository<Cookie>
  ) {}

  getData(code: string) {
    return this.cookiesRepository.findOne(code);
  }

  getAllData() {
    return this.cookiesRepository.find();
  }

  async createData(cookie: Cookie) {
    await this.cookiesRepository.insert(cookie);
  }

  updateData(cookie: Cookie) {
    this.cookiesRepository.save(cookie);
  }

  deleteData(code: string) {
    return this.cookiesRepository.delete(code);
  }
}
