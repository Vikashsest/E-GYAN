import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
