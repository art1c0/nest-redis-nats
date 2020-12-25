import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { tap, timeout } from 'rxjs/operators';
import { AppService } from './app.service';
import { EventDTO, EventMessagePattern, EventType } from './event.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send')
  public async send(@Query('amount') amount) {
    const event: EventDTO = {
      userId: 1,
      eventType: EventType.TypeA,
      createdAt: new Date(),
      currency: 'USD',
      amount: amount || 0,
    };
    try {
      await this.appService.sendEvent(event).pipe(timeout(5000)).toPromise();
    } catch (error) {
      return { error: error.message };
    }
    return event;
  }

  @EventPattern(EventMessagePattern)
  public async receive(event: EventDTO): Promise<any> {
    return this.appService.receiveEvent(event);
  }
}
