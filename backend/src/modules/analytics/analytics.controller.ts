import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Analytics, AnalyticsType } from '../analytics/entities/analytics.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}


  @Post('track')
  async track(@Body() data: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsService.trackAnalytics(data);
  }

  @Get('student/:id')
  async getByStudent(@Param('id') studentId: number): Promise<Analytics[]> {
    return this.analyticsService.getStudentAnalytics(studentId);
  }

  @Get('book/:id')
  async getByBook(@Param('id') bookId: number): Promise<Analytics[]> {
    return this.analyticsService.getBookAnalytics(bookId);
  }

  @Post('sync')
  async sync(@Body() records: Partial<Analytics>[]): Promise<Analytics[]> {
    return this.analyticsService.syncOfflineAnalytics(records);
  }
}
