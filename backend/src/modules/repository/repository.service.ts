import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { Repository } from 'typeorm';
import { Repositories } from './entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repositories)
    private readonly repository: Repository<Repositories>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
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

  // async create(createRepositoryDto: CreateRepositoryDto) {
  //   console.log(createRepositoryDto.category);

  //   const { text, type, category } = createRepositoryDto; // category add kiya

  //   if (!text || !type) throw new NotFoundException('Text or type missing');
  //   const repo = this.repository.create({ text, type, category });
  //   return await this.repository.save(repo);
  // }
  async create(dto: CreateRepositoryDto) {
    const repo = this.repository.create(dto);
    return this.repository.save(repo);
  }

  // async create(createRepositoryDto: CreateRepositoryDto) {
  //   const { text, type } = createRepositoryDto;
  //   if (!text || !type) throw new NotFoundException('Text or type missing');

  //   const repo = this.repository.create({ text, type });
  //   return await this.repository.save(repo);
  // }
  // async findAll(type?: string, category?: string) {
  //   const where: any = {};
  //   if (type) where.type = type;
  //   if (category) where.category = category;

  //   const resp = await this.repository.find({ where });
  //   let unique = new Set(resp);
  //   return unique;
  // }
  // async findAll(type?: string, category?: string) {
  //   const query = this.repository.createQueryBuilder('repo');

  //   if (type) {
  //     query.andWhere('repo.type = :type', { type });
  //   }

  //   if (category) {
  //     query.andWhere('repo.category = :category', { category });
  //   }

  //   query
  //     .select([
  //       'MIN(repo.id) as id',
  //       'repo.type as type',
  //       'repo.text as text',
  //       'repo.category as category',
  //     ])
  //     .groupBy('repo.text')
  //     .addGroupBy('repo.type')
  //     .addGroupBy('repo.category');

  //   return await query.getRawMany();
  // }

  async findAll(filters: any) {
    const query = this.repository.createQueryBuilder('repo');

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.andWhere(`repo.${key} = :${key}`, { [key]: value });
      }
    });

    return query.getMany();
  }

  async update(id: number, value: string) {
    try {
      const repo = await this.repository.findOne({ where: { id } });
      if (!repo) throw new NotFoundException(`Repository ${id} not found`);
      repo.text = value;

      return await this.repository.save(repo);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRepository(id: number) {
    const repo = await this.repository.findOne({ where: { id } });
    if (!repo) throw new NotFoundException(`Repository ${id} not found`);
    return await this.repository.delete(id);
  }

  async fetchAllBooks() {
    try {
      const allBooks = await this.bookRepo
        .createQueryBuilder('book')
        .select(['book.bookName'])
        .getMany();
      return allBooks;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch  Books');
    }
  }
  async findAllFilter(filters: any) {
    const qb = this.repository.createQueryBuilder('repo');

    const allowedFields = ['type', 'category', 'text'];

    Object.keys(filters).forEach((key) => {
      if (allowedFields.includes(key) && filters[key]) {
        qb.andWhere(`repo.${key} = :${key}`, {
          [key]: filters[key],
        });
      }
    });

    return qb.getMany();
  }
}
