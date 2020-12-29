import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { natsConfig } from './nats.config';
import { redisConfig } from './redis.config';

@Module({
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
})
export class AppModule {}
