import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto, PatchSectionDto, SectionDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('sections')
@UseGuards(AuthGuard)
@UseGuards(AdminGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Patch('update/:sectionId')
  @ApiOkResponse({
    type: SectionDto,
  })
  async patchSection(
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @Body() body: PatchSectionDto,
  ) {
    return this.sectionsService.patchSection(sectionId, body);
  }

  @Delete('delete/:sectionId')
  @ApiOkResponse()
  async deleteSection(@Param('sectionId', IdValidationPipe) sectionId: number) {
    return this.sectionsService.delete(sectionId);
  }
}
