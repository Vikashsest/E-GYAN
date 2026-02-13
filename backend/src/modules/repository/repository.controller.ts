import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Delete(':id')
  deleteRepo(@Param('id') id: number) {
    return this.repositoryService.deleteRepository(id);
  }

  @Post()
  createRepo(@Body() createDto: CreateRepositoryDto) {
    return this.repositoryService.create(createDto);
  }

  // @Get()
  // getAll(@Query('type') type?: string, @Query('category') category?: string) {
  //   return this.repositoryService.findAll(type, category);
  // }
  @Get()
  getAll(@Query() query: any) {
    return this.repositoryService.findAll(query);
  }

  @Patch(':id')
  updateRepo(@Param('id') id: number, @Body('value') value: string) {
    return this.repositoryService.update(id, value);
  }
  @Get('books')
  fetchBooks() {
    return this.repositoryService.fetchAllBooks();
  }
  @Get('filter')
  getQuery(@Query() query: any) {
    return this.repositoryService.findAllFilter(query);
  }
}
