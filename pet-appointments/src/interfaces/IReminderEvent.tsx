// src/interfaces/IReminderEvent.ts
export enum ReminderEventType {
  Feeding,
  Walk
}

export default interface IReminderEvent {
  id: string;
  eventType: ReminderEventType;
  eventTime: string;
  userId: string;
  petId: string;
}