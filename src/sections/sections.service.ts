import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateSectionBodyDto } from './dto';

@Injectable()
export class SectionsService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateSectionBodyDto) {
    return this.dbService.section.create({ data: dto });
  }
}
