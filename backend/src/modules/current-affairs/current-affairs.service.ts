import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCurrentAffairDto } from './dto/create-current-affair.dto';
import { UpdateCurrentAffairDto } from './dto/update-current-affair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentAffair } from './entities/current-affair.entity';
import { Repository } from 'typeorm';

import { generatePublicLink } from 'src/common/utils/nextcloud.config';
import { NextcloudService } from '../nextcloud/nextcloud.service';

@Injectable()
export class CurrentAffairsService {
  constructor(
    @InjectRepository(CurrentAffair)
    private readonly currentAffairRepository: Repository<CurrentAffair>,
       private readonly nextcloudService: NextcloudService,
    // private readonly googleDriveService: GoogleDriveService,
  ){}
//  async createCurrentAffair(dto: CreateCurrentAffairDto): Promise<CurrentAffair> {
//     try {
//       const newAffair = this.currentAffairRepository.create(dto);
//       return await this.currentAffairRepository.save(newAffair);
//     } catch (error) {
//       console.error('Error creating current affair:', error);
//       throw new InternalServerErrorException('Failed to create current affair');
//     }
//   }
async createCurrentAffair(
  dto: CreateCurrentAffairDto,
  file?: Express.Multer.File,
): Promise<CurrentAffair> {
  try {
    let imageLink: string | undefined = undefined;

    if (file) {

      const remotePath = `current_affairs/${Date.now()}_${file.originalname}`; // aapke folder ke under
      await this.nextcloudService.uploadBuffer(file.buffer, remotePath);

     
      imageLink = await generatePublicLink(remotePath); 
    }

    const newAffair = this.currentAffairRepository.create({
      ...dto,
      imageUrl: imageLink,
    });

    return await this.currentAffairRepository.save(newAffair);
  } catch (error) {
    console.error('Error creating current affair:', error);
    throw new InternalServerErrorException('Failed to create current affair');
  }
}



    async getAllCurrentAffairs(): Promise<CurrentAffair[]> {
    try {
      return await this.currentAffairRepository.find({ order: { date: 'DESC' } });
    } catch (error) {
      console.error('Error fetching current affairs:', error);
      throw new InternalServerErrorException('Failed to fetch current affairs');
    }
  }
  async getCurrentAffairById(id: number): Promise<CurrentAffair> {
    try {
      const affair=await this.currentAffairRepository.findOne({where:{id}})
      if(!affair){
        throw new NotFoundException('Current affair not found');
      }
      return affair
    } catch (error) {
        console.error('Error fetching current affair:', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException();
    }
  }
  
}
