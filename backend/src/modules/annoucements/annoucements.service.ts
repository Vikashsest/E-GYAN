import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { UpdateAnnoucementDto } from './dto/update-annoucement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Annoucement } from './entities/annoucement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnnoucementsService {
  constructor(
    @InjectRepository(Annoucement)
    private readonly annoucementRepo: Repository<Annoucement>,
  ) {}
  async create(createAnnoucementDto: CreateAnnoucementDto) {
    try {
      const { text } = createAnnoucementDto;
      console.log('text', text);
      const annoucement = await this.annoucementRepo.create({ text });

      return await this.annoucementRepo.save(annoucement);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Failed to  create annoucements');
    }
  }

  async findAll() {
    try {
      const fetchAnnoucement = await this.annoucementRepo.find();
      return fetchAnnoucement;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetech annoucemts');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} annoucement`;
  }

  update(id: number, updateAnnoucementDto: UpdateAnnoucementDto) {
    return `This action updates a #${id} annoucement`;
  }

  async remove(id: number) {
    try {
      const fetechId = await this.annoucementRepo.findOne({ where: { id } });
      if (!fetechId) {
        throw new HttpException('id not found', 400);
      }
      return await this.annoucementRepo.delete(fetechId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete announcement');
    }
  }
}
