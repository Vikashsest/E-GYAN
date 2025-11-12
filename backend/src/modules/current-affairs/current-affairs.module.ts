import { Module } from '@nestjs/common';
import { CurrentAffairsService } from './current-affairs.service';
import { CurrentAffairsController } from './current-affairs.controller';
import { CurrentAffair } from './entities/current-affair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
    TypeOrmModule.forFeature([CurrentAffair]), 
  ],

  controllers: [CurrentAffairsController],
  providers: [CurrentAffairsService],
})
export class CurrentAffairsModule {}
