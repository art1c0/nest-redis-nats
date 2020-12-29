import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'nestjs-redis';
import { Observable } from 'rxjs';
import { promisify } from 'util';
import { EventDto } from './event.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS') private readonly nats: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  public async getEvents(
    userId: number,
    start: number,
    stop: number,
  ): Promise<EventDto[]> {
    const redis = await this.redisService.getClient();
    const lrange = promisify(redis.lrange).bind(redis);
    const result = await lrange(`user:${userId}`, start, stop);
    return result.map((item) => AppService.deserialize(item));
  }

  public async receiveEvent(event: EventDto): Promise<number> {
    const redis = await this.redisService.getClient();
    const lpush = promisify(redis.lpush).bind(redis);
    return lpush(`user:${event.userId}`, AppService.serialize(event));
  }

  public sendEvent(pattern: any, event: EventDto): Observable<string> {
    return this.nats.emit<string, EventDto>(pattern, event);
  }

  static serialize(event: EventDto): string {
    return JSON.stringify(event);
  }

  static deserialize(input: string): EventDto {
    return <EventDto>JSON.parse(input);
  }
}
