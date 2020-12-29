export enum EventType {
  TypeA,
  TypeB,
}

export interface EventDto {
  userId: number;
  eventType: EventType;
  createdAt: Date;
  currency: string;
  amount: number;
}
