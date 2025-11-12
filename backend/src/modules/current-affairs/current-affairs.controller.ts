import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrentAffairsService } from './current-affairs.service';
import { CreateCurrentAffairDto } from './dto/create-current-affair.dto';
import { UpdateCurrentAffairDto } from './dto/update-current-affair.dto';

@Controller('current-affairs')
export class CurrentAffairsController {
  constructor(private readonly currentAffairsService: CurrentAffairsService) {}

  @Post()
  create(@Body() createCurrentAffairDto: CreateCurrentAffairDto) {
    return this.currentAffairsService.createCurrentAffair(createCurrentAffairDto);
  }

  // @Get()
  // findAll() {
  //   return this.currentAffairsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currentAffairsService.getCurrentAffairById(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCurrentAffairDto: UpdateCurrentAffairDto) {
  //   return this.currentAffairsService.update(+id, updateCurrentAffairDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.currentAffairsService.remove(+id);
  // }
}
