import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics, AnalyticsType } from '../analytics/entities/analytics.entity';

import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Chapter } from '../book/entities/chapter.entity';
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepo: Repository<Analytics>,
  ) {}

  async trackAnalytics(data: Partial<Analytics>): Promise<Analytics> {
    const record = this.analyticsRepo.create(data);
    return await this.analyticsRepo.save(record);
  }

  async getStudentAnalytics(studentId: number): Promise<Analytics[]> {
    return this.analyticsRepo.find({ where: { student: { id: studentId } } });
  }

  async getBookAnalytics(bookId: number): Promise<Analytics[]> {
    return this.analyticsRepo.find({ where: { book: { id: bookId } } });
  }

  async syncOfflineAnalytics(records: Partial<Analytics>[]): Promise<Analytics[]> {
    const analytics = this.analyticsRepo.create(records);
    return this.analyticsRepo.save(analytics);
  }
}