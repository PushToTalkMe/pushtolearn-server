import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCourseBodyDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(private readonly dbService: DbService) {}
  async create(dto: CreateCourseBodyDto & { author: string }) {
    return this.dbService.course.create({
      data: { ...dto },
    });
  }

  async getAllCourses() {
    return this.dbService.course.findMany();
  }
}
