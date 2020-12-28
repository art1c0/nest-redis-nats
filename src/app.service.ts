import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'nestjs-redis';
import { Observable } from 'rxjs';
import { promisify } from 'util';
import { EventDTO, EventMessagePattern } from './event.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS') private readonly client: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async getEvents(
    userId: number,
    start: number,
    stop: number,
  ): Promise<EventDTO[]> {
    const client = await this.redisService.getClient();
    const get = promisify(client.lrange).bind(client);
    const result = await get(`user:${userId}`, start, stop);
    return result.map((item) => AppService.deserialize(item));
  }

  public async receiveEvent(event: EventDTO): Promise<number> {
    const client = await this.redisService.getClient();
    const set = promisify(client.lpush).bind(client);
    return set(`user:${event.userId}`, AppService.serialize(event));
  }

  public sendEvent(event: EventDTO): Observable<any> {
    return this.client.emit(EventMessagePattern, event);
  }

  static serialize(event: EventDTO): string {
    return JSON.stringify(event);
  }

  static deserialize(input: string): EventDTO {
    return <EventDTO>JSON.parse(input);
  }
}
