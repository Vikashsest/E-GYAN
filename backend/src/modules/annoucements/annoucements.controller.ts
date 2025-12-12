import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnnoucementsService } from './annoucements.service';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { UpdateAnnoucementDto } from './dto/update-annoucement.dto';

@Controller('annoucements')
export class AnnoucementsController {
  constructor(private readonly annoucementsService: AnnoucementsService) {}

  @Post()
  create(@Body() createAnnoucementDto: CreateAnnoucementDto) {
    return this.annoucementsService.create(createAnnoucementDto);
  }

  @Get()
  findAll() {
    return this.annoucementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annoucementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnoucementDto: UpdateAnnoucementDto,
  ) {
    return this.annoucementsService.update(+id, updateAnnoucementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annoucementsService.remove(+id);
  }
}
