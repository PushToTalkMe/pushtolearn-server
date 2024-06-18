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
import { ACCESS_TOKEN, TEST_LOGIN, TEST_PASSWORD } from './constants';
import { extractCookieValue } from '../src/helpers/extract-cookie-value';
import { USER_DELETED } from '../src/users/constants';

const configService = new ConfigService();

const signTestDto: SignInBodyDto = {
  email: configService.get(TEST_LOGIN),
  password: configService.get(TEST_PASSWORD),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let cookies: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/sign-up (POST) === success', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(signTestDto)
      .expect(201)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        token = extractCookieValue(cookies[0], ACCESS_TOKEN);
        expect(token).toBeDefined();
        return;
      });
  });

  it('/auth/sign-out (POST) === success', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        token = extractCookieValue(cookies[0], ACCESS_TOKEN);
        expect(token).toBeFalsy();
        return;
      });
  });

  it('/auth/sign-in (POST) === success', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signTestDto)
      .expect(200)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        token = extractCookieValue(cookies[0], ACCESS_TOKEN);
        expect(token).toBeDefined();
        return;
      });
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

  it('/auth/sign-in (POST) === failed, wrong password', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ ...signTestDto, password: '2' })
      .expect(401, {
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/auth/sign-up (POST) === failed, email existed', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(signTestDto)
      .expect(400, {
        message: ALREADY_REGISTERED_ERROR,
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/auth/delete (DELETE) === success', async () => {
    return request(app.getHttpServer())
      .delete('/auth/delete')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const message = body.message;
        expect(message).toEqual(USER_DELETED);
        return;
      });
  });

  afterAll(async () => await app.close());
});
