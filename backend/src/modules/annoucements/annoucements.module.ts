import { Module } from '@nestjs/common';
import { AnnoucementsService } from './annoucements.service';
import { AnnoucementsController } from './annoucements.controller';
import { Annoucement } from './entities/annoucement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Annoucement])],
  controllers: [AnnoucementsController],
  providers: [AnnoucementsService],
})
export class AnnoucementsModule {}
