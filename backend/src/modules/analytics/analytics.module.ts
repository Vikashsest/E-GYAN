import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './entities/analytics.entity';
import { User } from '../user/entities/user.entity';
import { StudentActivity } from '../student/entities/student-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics,User,StudentActivity])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
