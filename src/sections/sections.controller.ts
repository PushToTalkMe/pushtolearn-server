import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateSectionBodyDto } from './dto';

@Controller('sections')
@UseGuards(AuthGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @ApiCreatedResponse()
  async create(@Body() dto: CreateSectionBodyDto) {
    return this.sectionsService.create(dto);
  }
}
