import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { AppService } from './app.service';
import { EventDto, EventType } from './event.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // set event pattern for exchange. can be any type
  static readonly eventPattern: string = 'event';

  @Get('events/:userId')
  public async getEvents(
    @Param('userId') userId,
    @Query('skip') skip?,
  ): Promise<EventDto[]> {
    // check incoming params
    userId = parseInt(userId);
    if (isNaN(userId))
      throw new HttpException('Please specify userId.', HttpStatus.BAD_REQUEST);
    skip = parseInt(skip);
    if (isNaN(skip) || skip < 0) skip = 0;
    // how many events per request
    const limit: number = skip + 10;
    return await this.appService.getEvents(userId, skip, limit);
  }

  @EventPattern(AppController.eventPattern)
  public async receiveEvent(event: EventDto): Promise<number> {
    return await this.appService.receiveEvent(event);
  }

  // this endpoint is solely for testing purposes and shall be removed later
  @Get('send/:userId')
  public async sendEvent(
    @Param('userId') userId,
    @Query('amount') amount?,
  ): Promise<EventDto> {
    // check incoming params
    userId = parseInt(userId);
    if (isNaN(userId))
      throw new HttpException('Please specify userId.', HttpStatus.BAD_REQUEST);
    amount = parseInt(amount);

    // generate random amount if not specified
    if (isNaN(amount)) amount = Math.round(Math.random() * 100);

    // create a mock event
    const event: EventDto = {
      userId: userId,
      eventType: EventType.TypeA,
      createdAt: new Date(),
      currency: 'USD',
      amount: amount,
    };
    await this.appService
      .sendEvent(AppController.eventPattern, event)
      .pipe(timeout(5000))
      .toPromise();
    return event;
  }
}
