import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EventDTO, EventMessagePattern } from './event.dto';

@Injectable()
export class AppService {
  constructor(@Inject('NATS') private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async receiveEvent(event: EventDTO): Promise<any> {
    // redis save
    console.log('receive', event);
    return Promise.resolve(event);
  }

  public sendEvent(event: EventDTO): Observable<any> {
    return this.client.emit(EventMessagePattern, event);
  }
}
