import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignInBodyDto } from '../src/auth/dto';
import { ConfigService } from '@nestjs/config';
import { STUDENT_LOGIN, STUDENT_PASSWORD } from './constants';
import { PatchAccountDto } from '../src/account/dto';
import { randomBytes } from 'crypto';

const configService = new ConfigService();

const signInStudentDto: SignInBodyDto = {
  email: configService.get(STUDENT_LOGIN),
  password: configService.get(STUDENT_PASSWORD),
};

const patchAccountDto: PatchAccountDto = {
  firstName: randomBytes(4).toString('hex'),
  lastName: randomBytes(4).toString('hex'),
};

const patchAccountDtoToDefault: PatchAccountDto = {
  firstName: '',
  lastName: '',
};

describe('AccountController (e2e)', () => {
  let app: INestApplication;
  let cookies: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInStudentDto)
      .expect(200)
      .then(({ headers }: request.Response) => {
        cookies = headers['set-cookie'];
        return;
      });
  });

  it('/account (GET) === success', async () => {
    return request(app.getHttpServer())
      .get('/account')
      .set('Cookie', cookies)
      .expect(200)
      .then(({ body }: request.Response) => {
        const sessionId = body.id;
        expect(sessionId).toBeDefined();
        return;
      });
  });

  it('/account (PATCH) === success', async () => {
    return request(app.getHttpServer())
      .patch('/account')
      .set('Cookie', cookies)
      .send(patchAccountDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { firstName, lastName, username } = body;
        expect(firstName).toEqual(patchAccountDto.firstName);
        expect(lastName).toEqual(patchAccountDto.lastName);
        expect(username).toBeFalsy();
        return;
      });
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .patch('/account')
      .set('Cookie', cookies)
      .send(patchAccountDtoToDefault)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { firstName, lastName, username } = body;
        expect(firstName).toBeFalsy();
        expect(lastName).toBeFalsy();
        expect(username).toBeFalsy();
        return;
      });
    await app.close();
  });
});
