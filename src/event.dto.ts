export enum EventType {
  TypeA,
  TypeB,
}

export class EventDTO {
  userId: number;
  eventType: EventType;
  createdAt: Date;
  currency: string;
  amount: number;
}

export const EventMessagePattern = 'event';
