import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { natsConfig } from './nats.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(natsConfig);
  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
