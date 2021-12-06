import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, isNil } from 'src/common/assert';
import { Repository } from 'typeorm';
import { CheckinRecord } from './checkin-record.entity';

@Injectable()
export class CheckinRecordService {
  constructor(
    @InjectRepository(CheckinRecord)
    private checkinRecordRepository: Repository<CheckinRecord>,
  ) {}

  getData(code: string) {
    return this.checkinRecordRepository.findOne(code);
  }

  getTodayData(code: string, platform: string) {
    return this.checkinRecordRepository
      .createQueryBuilder('checkin_record')
      .where('checkin_record.user_code = :code', { code: code })
      .andWhere('checkin_record.platform = :platform', { platform })
      .andWhere('checkin_record.created_at >= current_date')
      .getOne();
  }

  getAllData(code?: string) {
    if (code) {
      return this.checkinRecordRepository.find({
        where: { user_code: code },
        order: {
          created_at: 'DESC',
        },
      });
    }
    return this.checkinRecordRepository.find();
  }

  /**
   * 创建或更新签到记录（签到记录只记录当日自动签到成功或失败的记录，失败后手动签到则在失败的记录上更新）
   * @param checkinRecord 签到记录
   */
  async createOrUpdateData(checkinRecord: CheckinRecord) {
    var data = await this.getTodayData(checkinRecord.user_code, checkinRecord.platform);
    if (isNil(data)) {
      this.createData(checkinRecord);
    } else {
      checkinRecord.id = data.id;
      this.updateData(checkinRecord);
    }
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
