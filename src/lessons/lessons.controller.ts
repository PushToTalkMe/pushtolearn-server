import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('lessons')
@UseGuards(AuthGuard)
export class LessonsController {}
