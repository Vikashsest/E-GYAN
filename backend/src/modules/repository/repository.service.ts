import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { Repository } from 'typeorm';
import { Repositories } from './entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repositories)
    private readonly repository: Repository<Repositories>,
  ) {}
  // async create(createRepositoryDto: CreateRepositoryDto) {
  //   const { type, value } = createRepositoryDto;
  //   if (!type || !value) {
  //     throw new BadRequestException('Type and value are required');
  //   }

  //   let repo = await this.repository.findOne({ where: { id: 1 } });
  //   if (!repo) {
  //     repo = this.repository.create({
  //       Subjects: '',
  //       EducationLevels: '',
  //       Languages: '',
  //       Categories: '',
  //       ResourceTypes: '',
  //     });
  //   }

  //   if (type === 'resource') {
  //     repo.ResourceTypes = [repo.ResourceTypes, value]
  //       .filter(Boolean)
  //       .join(',');
  //   }
  //   if (type === 'subject') {
  //     repo.Subjects = [repo.Subjects, value].filter(Boolean).join(',');
  //   }
  //   if (type === 'level') {
  //     repo.EducationLevels = [repo.EducationLevels, value]
  //       .filter(Boolean)
  //       .join(',');
  //   }
  //   if (type === 'language') {
  //     repo.Languages = [repo.Languages, value].filter(Boolean).join(',');
  //   }
  //   if (type === 'category') {
  //     repo.Categories = [repo.Categories, value].filter(Boolean).join(',');
  //   }

  //   return this.repository.save(repo);
  // }

  async create(createRepositoryDto: CreateRepositoryDto) {
    const { text, type } = createRepositoryDto;
    if (!text || !type) throw new NotFoundException('Text or type missing');

    const repo = this.repository.create({ text, type });
    return await this.repository.save(repo);
  }
  async findAll(type?: string) {
    if (type) {
      return await this.repository.find({ where: { type } });
    }
    return await this.repository.find();
  }

  async update(id: number, value: string) {
    const repo = await this.repository.findOne({ where: { id } });
    if (!repo) throw new NotFoundException(`Repository ${id} not found`);
    repo.text = value;
    return await this.repository.save(repo);
  }

  async deleteRepository(id: number) {
    const repo = await this.repository.findOne({ where: { id } });
    if (!repo) throw new NotFoundException(`Repository ${id} not found`);
    return await this.repository.delete(id);
  }
}
