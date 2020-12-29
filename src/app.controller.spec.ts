import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { natsConfig } from './nats.config';
import { redisConfig } from './redis.config';
import { EventDto, EventType } from './event.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'NATS',
            ...natsConfig,
          },
        ]),
        RedisModule.register(redisConfig),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Send event to UserId#0', () => {
    const event: EventDto = {
      userId: 0,
      eventType: EventType.TypeB,
      createdAt: new Date(),
      currency: 'USD',
      amount: Math.round(Math.random() * 100),
    };

    it('should insert event into redis and return its index (Number >0)', async () => {
      expect(appService.receiveEvent(event)).resolves.toBeGreaterThan(0);
    });

    it('should return Number >0 from appController', async () => {
      expect(appController.receiveEvent(event)).resolves.toBeGreaterThan(0);
    });
  });

  describe('Get events of UserId#0', () => {
    it('should read events for a user.id 0 from redis and return Array', async () => {
      expect(appService.getEvents(0, 0, 0)).resolves.toBeInstanceOf(Array);
    });

    it('should return Array from appController', async () => {
      expect(appController.getEvents(0, 0)).resolves.toBeInstanceOf(Array);
    });

    it(`should return Array of EventDto from API`, (done) => {
      return request(app.getHttpServer())
        .get('/events/0')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if (res.body instanceof Array) {
            if (res.body.length > 0) {
              expect(res.body[0]).toMatchObject({
                userId: expect.any(Number),
                eventType: expect.any(Number),
                createdAt: expect.any(String), // not a Date for some reason?
                currency: expect.any(String),
                amount: expect.any(Number),
              });
              console.log('Performed EventDto matching');
            }
            done();
          } else {
            done(new Error('API response is not Array.'));
          }
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
