import {
  Controller,
  Get,
  HttpException,
  HttpStatus, Param,
  Query
} from "@nestjs/common";
import { EventPattern } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { AppService } from './app.service';
import { EventDTO, EventMessagePattern, EventType } from './event.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('events/:userId')
  public async getEvents(
    @Param('userId') userId,
    @Query('skip') skip,
  ): Promise<any> {
    if (!userId || isNaN(userId))
      throw new HttpException('Please specify userId.', HttpStatus.BAD_REQUEST);
    userId = parseInt(userId);
    skip = !skip || isNaN(skip) ? 0 : parseInt(skip);
    if (skip < 0) skip = 0;
    const limit = skip + 10; // how many events per request
    return await this.appService.getEvents(userId, skip, limit);
  }

  @Get('send/:userId')
  public async send(
    @Param('userId') userId,
    @Query('amount') amount,
  ): Promise<any> {
    if (!userId || isNaN(userId))
      throw new HttpException('Please specify userId.', HttpStatus.BAD_REQUEST);
    userId = parseInt(userId);
    // generate random amount if not specified
    amount =
      !amount || isNaN(amount)
        ? Math.round(Math.random() * 100)
        : parseInt(amount);
    const event: EventDTO = {
      userId: userId,
      eventType: EventType.TypeB,
      createdAt: new Date(),
      currency: 'USD',
      amount: amount,
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
    const result = await this.appService.receiveEvent(event);
    console.log(`UserId#${event.userId} received event #${result}:`, event);
  }
}
