import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { BookProgress } from './entities/book-progress.entity';
import { Announcement } from '../student/entities/announcement.entity';
import { Chapter } from './entities/chapter.entity';
import { NextcloudService } from '../nextcloud/nextcloud.service';
import { NextcloudModule } from '../nextcloud/nextcloud.module';
import { StudentActivity } from '../student/entities/student-activity.entity';
import { Simulation } from './entities/simulation';
@Module({
   imports: [TypeOrmModule.forFeature([Book,User,BookProgress,Announcement,Chapter,StudentActivity,Simulation]),UserModule,NextcloudModule],
  controllers: [BookController],
  providers: [BookService,NextcloudService],
})
export class BookModule {}
