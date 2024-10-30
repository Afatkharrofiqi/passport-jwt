import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('LoginController', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = app.get(JwtService);
    await app.init();
  });

  describe('(POST) /auth/login', function(){
    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'arthur',
          password: 'password'
        });

      expect(response.status).toBe(201);
      expect(response.text).toBeDefined;
    });

    it('should be rejected if username not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'arthur1',
          password: 'password'
        });
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  })

  describe('(GET) /auth/status', function(){
    let token = '';
    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'arthur',
          password: 'password'
        });
      
      token = response.text;
  
      expect(response.status).toBe(201);
      expect(response.text).toBeDefined;
    });

    it('should be rejected if token invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/status')
        .set('Authorization', `Bearer ${token}1`)
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should be able to get status', async () => {
      const decoded = jwtService.decode(token);
      const response = await request(app.getHttpServer())
        .get('/auth/status')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(decoded.id);
      expect(response.body.username).toBe(decoded.username);
      expect(response.body.iat).toBe(decoded.iat);
      expect(response.body.exp).toBe(decoded.exp);
    });
  })
});
