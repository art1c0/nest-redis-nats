export enum EventType {
  TypeA,
  TypeB,
}

export interface EventDTO {
  userId: number;
  eventType: EventType;
  createdAt: Date;
  currency: string;
  amount: number;
}

export const EventMessagePattern = 'event';
