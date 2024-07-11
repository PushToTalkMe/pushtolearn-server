import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExerciseDto, PatchExerciseDto } from '../exercise/dto';
import { PatchTestDto, TestDto } from '../test/dto';
import { PatchTheoryDto, TheoryDto } from '../theory/dto';

export class CreateLessonDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  title: string;

  @ApiProperty({
    example: {
      content:
        '\n# Работа с данными в MongoDB Compass\n\n---\n\n## Работа с данными в MongoDB Compass\n\nВ предыдущих темах рассматривалась работа с сервером MongoDB через консольную оболочку **mongosh**. Но также мы можем работать с данными через графический клиент **MongoDB Compass**. Данный графический клиент довольно прост и инутивно понятен в использовании, а графическое представление данных для кого-то может быть проще для понимание. Соответственно кому-то, возможно, через графический клиент будет проще и удобнее работать.\n\nДля базовых операций, как то: создание/удаление коллекций, добавление, просмотр, изменения и удаления документов есть соответствующие элементы графического интерфейса:\n\n<p align="center">\n  <img alt="Скриншот результата выполнения кода сверху" src="./img/2.9.png"/>\n</p>\n```js\nconst a = 123\n```    ',
    },
  })
  data: PatchTestDto & PatchExerciseDto & PatchTheoryDto;

  @ApiProperty({
    enum: [
      $Enums.LessonType.Theory,
      $Enums.LessonType.Test,
      $Enums.LessonType.Exercise,
    ],
  })
  @IsIn([
    $Enums.LessonType.Theory,
    $Enums.LessonType.Test,
    $Enums.LessonType.Exercise,
  ])
  type: $Enums.LessonType;

  @ApiProperty({ example: 5 })
  @IsNumber()
  sectionId: number;
}

@ApiExtraModels(TheoryDto, TestDto, ExerciseDto)
export class PatchLessonDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: { content: '##Введение' },
    oneOf: [
      { $ref: getSchemaPath(TheoryDto) },
      { $ref: getSchemaPath(TestDto) },
      { $ref: getSchemaPath(ExerciseDto) },
    ],
  })
  @IsOptional()
  data?: PatchTestDto & PatchExerciseDto & PatchTheoryDto;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  sequence?: number;
}

@ApiExtraModels(TheoryDto, TestDto, ExerciseDto)
export class LessonDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 1 })
  sectionId: number;

  @ApiProperty({ example: 2 })
  sequence: number;

  @ApiProperty({ example: 'Что такое NestJS' })
  title: string;

  @ApiProperty({
    example: {
      content: `
# Работа с данными в MongoDB Compass

---

## Работа с данными в MongoDB Compass

В предыдущих темах рассматривалась работа с сервером MongoDB через консольную оболочку **mongosh**. Но также мы можем работать с данными через графический клиент **MongoDB Compass**. Данный графический клиент довольно прост и инутивно понятен в использовании, а графическое представление данных для кого-то может быть проще для понимание. Соответственно кому-то, возможно, через графический клиент будет проще и удобнее работать.

Для базовых операций, как то: создание/удаление коллекций, добавление, просмотр, изменения и удаления документов есть соответствующие элементы графического интерфейса:

<p align="center">
  <img alt="Скриншот результата выполнения кода сверху" src="./img/2.9.png"/>
</p>
`,
    },
    oneOf: [
      { $ref: getSchemaPath(TheoryDto) },
      { $ref: getSchemaPath(TestDto) },
      { $ref: getSchemaPath(ExerciseDto) },
    ],
  })
  data: TestDto | ExerciseDto | TheoryDto;

  @ApiProperty({
    enum: [
      $Enums.LessonType.Theory,
      $Enums.LessonType.Test,
      $Enums.LessonType.Exercise,
    ],
  })
  type: $Enums.LessonType;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}

export class LessonDtoWithViewed extends LessonDto {
  @ApiProperty({ example: false })
  viewed: boolean;
}

export class LessonStat {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'Что такое NestJS' })
  title: string;

  @ApiProperty({
    enum: [
      $Enums.LessonType.Theory,
      $Enums.LessonType.Test,
      $Enums.LessonType.Exercise,
    ],
  })
  type: $Enums.LessonType;

  @ApiProperty({ example: true })
  viewed: boolean;

  @ApiProperty({ example: 1 })
  sequence: number;
}
