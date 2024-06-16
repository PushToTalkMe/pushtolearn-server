import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionBodyDto, PatchSectionDto } from './dto';
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
  async create(@Body() dto: CreateSectionBodyDto) {
    return this.sectionsService.create(dto);
  }

  @Patch('update/:sectionId')
  @ApiOkResponse({
    type: CreateSectionBodyDto,
  })
  async patchCourse(
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @Body() body: PatchSectionDto,
  ) {
    return this.sectionsService.patchSection(sectionId, body);
  }
}
