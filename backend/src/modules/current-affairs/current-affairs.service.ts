import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCurrentAffairDto } from './dto/create-current-affair.dto';
import { UpdateCurrentAffairDto } from './dto/update-current-affair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentAffair } from './entities/current-affair.entity';
import { Repository } from 'typeorm';
import { uploadToGoogleDrive } from 'src/common/utils/googleDriveUtil';

@Injectable()
export class CurrentAffairsService {
  constructor(
    @InjectRepository(CurrentAffair)
    private readonly currentAffairRepository: Repository<CurrentAffair>,
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
  image?: Express.Multer.File,
): Promise<CurrentAffair> {
  try {
    let imageLink: string | undefined = undefined; // ✅ null -> undefined
    if (image) {
      const uploaded = await uploadToGoogleDrive(image, process.env.GOOGLE_DRIVE_FOLDER_ID);
      imageLink = uploaded.downloadLink; 
    }
    const newAffair = this.currentAffairRepository.create({
      ...dto,
      imageUrl: imageLink, // ✅ now type matches string | undefined
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
