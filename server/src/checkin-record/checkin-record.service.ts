import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckinRecord } from './checkin-record.entity';

@Injectable()
export class CheckinRecordService {
  constructor(
    @InjectRepository(CheckinRecord)
    private checkinRecordRepository: Repository<CheckinRecord>
  ) {}

  getData(code: string) {
    return this.checkinRecordRepository.findOne(code);
  }

  getAllData(code?: string) {
    if (code) {
      return this.checkinRecordRepository.find({
        where: { user_code: code },
        order: {
          created_at: 'DESC'
        }
      });
    }
    return this.checkinRecordRepository.find();
  }

  async createData(checkinRecord: CheckinRecord) {
    await this.checkinRecordRepository.insert(checkinRecord);
  }

  updateData(checkinRecord: CheckinRecord) {
    this.checkinRecordRepository.save(checkinRecord);
  }

  deleteData(code: string) {
    return this.checkinRecordRepository.delete(code);
  }
}
