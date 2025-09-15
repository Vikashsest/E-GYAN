import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { Repositories } from './entities/repository.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [TypeOrmModule.forFeature([Repositories])],
  controllers: [RepositoryController],
  providers: [RepositoryService],
    exports: [RepositoryService],
})
export class RepositoryModule {}
