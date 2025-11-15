import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAffairsService } from './current-affairs.service';
import { CreateCurrentAffairDto } from './dto/create-current-affair.dto';

@Controller('current-affairs')
export class CurrentAffairsController {
  constructor(
    private readonly currentAffairsService: CurrentAffairsService, // ✅ GoogleDriveService removed
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 👈 important line
  async create(
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: any, 
  ) {
    const dto: CreateCurrentAffairDto = {
      title: body.title?.toString(),
      category: body.category?.toString(),
      mainCategory: body.mainCategory?.toString(),
      description: body.description?.toString(),
      date: body.date?.toString(),
      source: body.source?.toString(),
      link: body.link?.toString(),
    };

    return this.currentAffairsService.createCurrentAffair(dto, file);
  }
  @Get()
  async fetechAll(){
    return this.currentAffairsService.getAllCurrentAffairs()
  }
  @Get("/:id")
  async fetechById(@Body('id') id: number){
    return this.currentAffairsService.getCurrentAffairById(id)
  }
}
