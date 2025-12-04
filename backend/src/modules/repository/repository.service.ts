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
  async create(createRepositoryDto: CreateRepositoryDto) {
    const { type, value } = createRepositoryDto;
    if (!type || !value) {
      throw new BadRequestException('Type and value are required');
    }

    let repo = await this.repository.findOne({ where: { id: 1 } });
    if (!repo) {
      repo = this.repository.create({
        Subjects: '',
        EducationLevels: '',
        Languages: '',
        Categories: '',
        ResourceTypes: '',
      });
    }

    if (type === 'resource') {
      repo.ResourceTypes = [repo.ResourceTypes, value]
        .filter(Boolean)
        .join(',');
    }
    if (type === 'subject') {
      repo.Subjects = [repo.Subjects, value].filter(Boolean).join(',');
    }
    if (type === 'level') {
      repo.EducationLevels = [repo.EducationLevels, value]
        .filter(Boolean)
        .join(',');
    }
    if (type === 'language') {
      repo.Languages = [repo.Languages, value].filter(Boolean).join(',');
    }
    if (type === 'category') {
      repo.Categories = [repo.Categories, value].filter(Boolean).join(',');
    }

    return this.repository.save(repo);
  }

  async findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} repository`;
  }

  async deleteRepository(id: number) {
    const repoId = await this.repository.find({ where: { id } });
    if (!repoId) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }
    return await this.repository.delete(repoId);
  }
}
