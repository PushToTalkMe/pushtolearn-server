import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignInBodyDto } from '../src/auth/dto';
import {
  ALREADY_REGISTERED_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';
import { ConfigService } from '@nestjs/config';
import { STUDENT_LOGIN, STUDENT_PASSWORD, ACCESS_TOKEN } from './constants';
import { extractCookieValue } from '../src/helpers/extract-cookie-value';

const configService = new ConfigService();

const signInStudentDto: SignInBodyDto = {
  email: configService.get(STUDENT_LOGIN),
  password: configService.get(STUDENT_PASSWORD),
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let cookies: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/sign-in (POST) === success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInStudentDto)
      .expect(200);
    cookies = res.headers['set-cookie'];
    token = extractCookieValue(cookies[0], ACCESS_TOKEN);
    expect(token).toBeDefined();
    return;
  });

  it('/auth/session (GET) === success', async () => {
    return request(app.getHttpServer())
      .get('/auth/session')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const sessionId = body.id;
        expect(sessionId).toBeDefined();
        return;
      });
  });

  it('/auth/sign-out (POST) === success', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Cookie', cookies)
      .expect(200);
  });

  it('/auth/sign-in (POST) === failed, wrong password', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ ...signInStudentDto, password: '2' })
      .expect(401, {
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/auth/sign-up (POST) === failed, email existed', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(signInStudentDto)
      .expect(400, {
        message: ALREADY_REGISTERED_ERROR,
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  afterAll(async () => await app.close());
});
