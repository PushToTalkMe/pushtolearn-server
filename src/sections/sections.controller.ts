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
import {
  CreateSectionDto,
  PatchSectionDto,
  PatchSequence,
  PatchSequences,
  SectionDto,
} from './dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { SessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';

@Controller('sections')
@UseGuards(AuthGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(
    @Body() dto: CreateSectionDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.sectionsService.create(dto, session.id, session.role);
  }

  @Patch('update/:sectionId')
  @ApiOkResponse({
    type: SectionDto,
  })
  async patchSection(
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @Body() body: PatchSectionDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.sectionsService.patchSection(
      sectionId,
      body,
      session.id,
      session.role,
    );
  }

  @Post('update/sequences')
  @ApiOkResponse()
  async patchSequences(
    @Body() body: PatchSequences,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.sectionsService.patchSequences(body, session.id, session.role);
  }

  @Delete('delete/:sectionId')
  @ApiOkResponse({
    type: SectionDto,
  })
  async deleteSection(
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.sectionsService.delete(sectionId, session.id, session.role);
  }
}
