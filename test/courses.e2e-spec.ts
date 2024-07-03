import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignInBodyDto, SignUpBodyDto } from '../src/auth/dto';
import { ConfigService } from '@nestjs/config';
import {
  ADMIN_LOGIN,
  ADMIN_PASSWORD,
  CONTENT,
  EXERCISE,
  QUESTIONS,
  STUDENT_LOGIN,
  STUDENT_PASSWORD,
  TASKS,
  TEST,
  THEORY,
} from './constants';
import {
  CreateCourseDto,
  CourseDto,
  CourseDtoWithSections,
} from '../src/courses/dto';
import { NOT_PERMITTED } from '../src/auth/admin.constants';
import { CreateSectionDto } from '../src/sections/dto';
import { CreateLessonDto, LessonDto } from '../src/lessons/dto';
import { LESSON_NOT_FOUND, SECTION_NOT_FOUND } from '../src/courses/constants';
import { USER_DELETED } from '../src/users/constants';
import { randomBytes } from 'crypto';

const configService = new ConfigService();

const signInAdminDto: SignInBodyDto = {
  email: configService.get(ADMIN_LOGIN),
  password: configService.get(ADMIN_PASSWORD),
};

const signUpAdminDto: SignUpBodyDto = {
  email: configService.get(ADMIN_LOGIN),
  password: configService.get(ADMIN_PASSWORD),
  firstName: randomBytes(4).toString('hex'),
  lastName: randomBytes(4).toString('hex'),
};

const signInStudentDto: SignInBodyDto = {
  email: configService.get(STUDENT_LOGIN),
  password: configService.get(STUDENT_PASSWORD),
};

const signUpStudentDto: SignUpBodyDto = {
  email: configService.get(STUDENT_LOGIN),
  password: configService.get(STUDENT_PASSWORD),
  firstName: randomBytes(4).toString('hex'),
  lastName: randomBytes(4).toString('hex'),
};

const testCourseDto: CreateCourseDto = {
  title: 'Основы JavaScript',
  img: 'uri',
  duration: '7.5 часов',
  tags: ['JavaScript', 'Frontend', 'Backend'],
  price: 999,
};

const testSectionDto: CreateSectionDto = {
  title: 'Введение',
  courseId: 0,
};

const testLessonDto: CreateLessonDto = {
  title: 'Основы JavaScript',
  data: { questions: QUESTIONS },
  type: TEST,
  sectionId: 0,
};

describe('CourseController, BuyController, SectionController и LessonController - e2e', () => {
  let app: INestApplication;
  let courseId: number;
  let sectionId: number;
  let lessonId: number;
  let cookies: string;
  let sectionIdForDelete: number;
  let lessonIdFromSectionForDelete: number;
  let updatedTitleLesson: string;
  let updatedTitleSection: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(signUpStudentDto)
      .expect(201)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        return;
      });

    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(signUpAdminDto)
      .expect(201)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        return;
      });
  });

  it('/courses/create (POST) === success (Создание курса администратором)', async () => {
    return request(app.getHttpServer())
      .post('/courses/create')
      .set('Cookie', cookies)
      .send(testCourseDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        courseId = body.id;
        expect(courseId).toBeDefined();
        return;
      });
  });

  it('/sections/create (POST) === success (Создание раздела №1 для этого курса)', async () => {
    return request(app.getHttpServer())
      .post('/sections/create')
      .set('Cookie', cookies)
      .send({ ...testSectionDto, courseId })
      .expect(201)
      .then(({ body }: request.Response) => {
        sectionId = body.id;
        expect(sectionId).toBeDefined();
        return;
      });
  });

  it('/sections/update/:sectionId (PATCH) === success (Смена названия раздела №1))', async () => {
    const title = 'Основы';
    return request(app.getHttpServer())
      .patch('/sections/update/' + sectionId)
      .set('Cookie', cookies)
      .send({ title })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toEqual(title);
        updatedTitleSection = title;
        return;
      });
  });

  it('/lessons/create (POST) === success (Создание урока №1 (типа Test) для раздела №1)', async () => {
    return request(app.getHttpServer())
      .post('/lessons/create')
      .set('Cookie', cookies)
      .send({ ...testLessonDto, sectionId })
      .expect(201)
      .then(({ body }: request.Response) => {
        lessonId = body.id;
        expect(lessonId).toBeDefined();
        return;
      });
  });

  it('/lessons/update/:lessonId (PATCH) === success (Смена названия урока №1)', async () => {
    const title = 'Основы программирования';
    return request(app.getHttpServer())
      .patch('/lessons/update/' + lessonId)
      .set('Cookie', cookies)
      .send({ title })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toEqual(title);
        updatedTitleLesson = title;
        return;
      });
  });

  it('/sections/delete/:sectionId (DELETE) === success (Создание раздела №2 для этого курса, создание урока №1 для этого раздела, затем удаление этого раздела №2 со всеми уроками (то есть уроком №1))', async () => {
    await request(app.getHttpServer())
      .post('/sections/create')
      .set('Cookie', cookies)
      .send({ ...testSectionDto, courseId })
      .expect(201)
      .then(({ body }: request.Response) => {
        sectionIdForDelete = body.id;
        expect(sectionIdForDelete).toBeDefined();
        return;
      });
    await request(app.getHttpServer())
      .post('/lessons/create')
      .set('Cookie', cookies)
      .send({ ...testLessonDto, sectionId: sectionIdForDelete })
      .expect(201)
      .then(({ body }: request.Response) => {
        lessonIdFromSectionForDelete = body.id;
        expect(body.id).toBeDefined();
        return;
      });
    return request(app.getHttpServer())
      .delete('/sections/delete/' + sectionIdForDelete)
      .set('Cookie', cookies)
      .expect(200);
  });

  it('/sections/update/:sectionId (PATCH) === failed, Bad Request (Попытка сменить название у уже несуществующего раздела №2)', async () => {
    const title = 'Основы программирования';
    return request(app.getHttpServer())
      .patch('/sections/update/' + sectionIdForDelete)
      .set('Cookie', cookies)
      .send({ title })
      .expect(404, {
        message: SECTION_NOT_FOUND,
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('/lessons/update/:lessonId (PATCH) === failed, Not Found (Попытка обновить название у уже несуществуюшего урока №1 в уже несуществующем разделе №2)', async () => {
    const title = 'Основы программирования';
    return request(app.getHttpServer())
      .patch('/lessons/update/' + lessonIdFromSectionForDelete)
      .set('Cookie', cookies)
      .send({ title })
      .expect(404, {
        message: LESSON_NOT_FOUND,
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('/lessons/delete/:lessonId (DELETE) === success (Создание урока №2 (типа Exercise) для разделе №1 и его последующее удаление)', async () => {
    let lessonIdForDelete: number;
    await request(app.getHttpServer())
      .post('/lessons/create')
      .set('Cookie', cookies)
      .send({
        ...testLessonDto,
        sectionId,
        type: EXERCISE,
        data: { tasks: TASKS },
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        lessonIdForDelete = body.id;
        expect(lessonIdForDelete).toBeDefined();
        return;
      });
    return request(app.getHttpServer())
      .delete('/lessons/delete/' + lessonIdForDelete)
      .set('Cookie', cookies)
      .expect(200);
  });

  it('/lessons/create (POST) === success (Создание урока №3 (типа Theory) для разделе №1)', async () => {
    await request(app.getHttpServer())
      .post('/lessons/create')
      .set('Cookie', cookies)
      .send({
        ...testLessonDto,
        sectionId,
        type: THEORY,
        data: { content: CONTENT },
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        lessonId = body.id;
        expect(lessonId).toBeDefined();
        return;
      });
  });

  it('/courses/create (POST) === failed, not permitted (Попытка создать курс обычным пользователем)', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInStudentDto)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        return;
      });
    return request(app.getHttpServer())
      .post('/courses/create')
      .set('Cookie', cookies)
      .send(testCourseDto)
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/sections/create (POST) === failed, not permitted (Попытка создать раздел обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .post('/sections/create')
      .set('Cookie', cookies)
      .send({ ...testSectionDto, courseId })
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/sections/update/:sectionId (PATCH) === failed, not permitted (Попытка сменить название у раздела №1 обычным пользователем)', async () => {
    const title = 'Основы';
    return request(app.getHttpServer())
      .patch('/sections/update/' + sectionId)
      .set('Cookie', cookies)
      .send({ title })
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/lessons/create (POST) === failed, not permitted (Попытка создать урок обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .post('/lessons/create')
      .set('Cookie', cookies)
      .send({ ...testLessonDto, sectionId })
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/lessons/update/:lessonId (PATCH) === failed, not permitted (Попытка сменить название у урока №1 обычным пользователем)', async () => {
    const title = 'Основы программирования';
    return request(app.getHttpServer())
      .patch('/sections/update/' + lessonId)
      .set('Cookie', cookies)
      .send({ title })
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/courses (GET) === success (Получение списка не купленных курсов обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .get('/courses')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const course = body.find((course: CourseDto) => course.id === courseId);
        expect(course).toBeDefined();
        return;
      });
  });

  it('/courses/notMy/:courseId (GET) === success (Проверка и получение не купленного курса перед покупкой + с количеством уроков)', async () => {
    return request(app.getHttpServer())
      .get('/courses/notMy/' + courseId)
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const lessonCount = body.lessonCount;
        expect(lessonCount).toEqual(2);
        return;
      });
  });

  it('/buy/:courseId (POST) === success (Покупка курса обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .post('/buy/' + courseId)
      .set('Cookie', cookies)
      .send(testCourseDto)
      .expect(201);
  });

  it('/courses/my (GET) === success (Получение списка купленных курсов обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .get('/courses/my')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const course = body.find((course: CourseDto) => course.id === courseId);
        expect(course).toBeDefined();
        return;
      });
  });

  it('/courses/my/:courseId (GET) === success (Просмотр купленного курса с названиями всех секций и названиями и типами всех уроков обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .get('/courses/my/' + courseId)
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const course: CourseDtoWithSections = body;
        expect(course.id).toEqual(courseId);
        expect(course.sectionsWithLessonsTitleAndType[0].title).toEqual(
          updatedTitleSection,
        );
        expect(
          course.sectionsWithLessonsTitleAndType[0].lessonsTitleAndType[0]
            .title,
        ).toEqual(updatedTitleLesson);
        return;
      });
  });

  it('/courses/my/:courseId/sections/:sectionId/lessons/:lessonId (GET) === success (Просмотр урока купленного курса)', async () => {
    return request(app.getHttpServer())
      .get(
        '/courses/my/' +
          courseId +
          '/sections/' +
          sectionId +
          '/lessons/' +
          lessonId,
      )
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const lesson: LessonDto = body;
        expect(lesson.id).toEqual(lessonId);
        return;
      });
  });

  it('/courses/ (DELETE) === failed, not permitted (Попытка удалить курс обычным пользователем)', async () => {
    return request(app.getHttpServer())
      .delete('/courses/' + courseId)
      .set('Cookie', cookies)
      .send(testCourseDto)
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/courses/:courseId (DELETE) === success (Удаление курса со всеми принадлежамищи ему секциями и уроками администратором)', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInAdminDto)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        return;
      });
    return request(app.getHttpServer())
      .delete('/courses/' + courseId)
      .set('Cookie', cookies)
      .send(testCourseDto)
      .expect(200);
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/auth/delete')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const message = body.message;
        expect(message).toEqual(USER_DELETED);
        return;
      });
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInStudentDto)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        return;
      });
    await request(app.getHttpServer())
      .delete('/auth/delete')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const message = body.message;
        expect(message).toEqual(USER_DELETED);
        return;
      });
    await app.close();
  });
});
