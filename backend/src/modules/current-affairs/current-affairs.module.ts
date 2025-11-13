import { Module } from '@nestjs/common';
import { CurrentAffairsService } from './current-affairs.service';
import { CurrentAffairsController } from './current-affairs.controller';
import { CurrentAffair } from './entities/current-affair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleDriveService } from 'src/common/utils/googleDriveUtil';
import { NextcloudService } from '../nextcloud/nextcloud.service';

@Module({
    imports: [
    
    TypeOrmModule.forFeature([CurrentAffair]), 
  ],

  controllers: [CurrentAffairsController],
  providers: [CurrentAffairsService, NextcloudService],
})
export class CurrentAffairsModule {}
