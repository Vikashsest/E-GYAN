import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '../book/entities/chapter.entity';
import { ChapterEmbedding } from './entities/chapter-embedding.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterEmbedding, Chapter])],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
