import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignInBodyDto } from '../src/auth/dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ADMIN_LOGIN,
  ADMIN_PASSWORD,
  STUDENT_LOGIN,
  STUDENT_PASSWORD,
} from './constants';
import { CreateCourseBodyDto } from '../src/courses/dto';
import { extractCookieValue } from '../src/helpers/extract-cookie-value';
import { NOT_PERMITTED } from '../src/auth/admin.constants';

const configService = new ConfigService();

const signInAdminDto: SignInBodyDto = {
  email: configService.get(ADMIN_LOGIN),
  password: configService.get(ADMIN_PASSWORD),
};

const signInStudentDto: SignInBodyDto = {
  email: configService.get(STUDENT_LOGIN),
  password: configService.get(STUDENT_PASSWORD),
};

const testCourseDto: CreateCourseBodyDto = {
  title: 'Основы JavaScript',
  img: 'uri',
  duration: '7.5 часов',
  tags: ['JavaScript', 'Frontend', 'Backend'],
  price: 999,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let courseId: number;
  let cookieHeader: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/courses/create (POST) = success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInAdminDto);
    cookieHeader = res.headers['set-cookie'];
    return request(app.getHttpServer())
      .post('/courses/create')
      .set('Cookie', cookieHeader)
      .send(testCourseDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        courseId = body.id;
        expect(courseId).toBeDefined();
        return;
      });
  });

  it('/courses/create (POST) = failed, not permitted', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInStudentDto);
    cookieHeader = res.headers['set-cookie'];
    return request(app.getHttpServer())
      .post('/courses/create')
      .set('Cookie', cookieHeader)
      .send(testCourseDto)
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/courses/ (DELETE) = failed, not permitted', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInStudentDto);
    cookieHeader = res.headers['set-cookie'];
    return request(app.getHttpServer())
      .delete('/courses/' + courseId)
      .set('Cookie', cookieHeader)
      .send(testCourseDto)
      .expect(403, {
        message: NOT_PERMITTED,
        error: 'Forbidden',
        statusCode: 403,
      });
  });

  it('/courses/ (DELETE) = success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInAdminDto);
    cookieHeader = res.headers['set-cookie'];
    return request(app.getHttpServer())
      .delete('/courses/' + courseId)
      .set('Cookie', cookieHeader)
      .send(testCourseDto)
      .expect(200);
  });

  afterAll(async () => await app.close());
});
