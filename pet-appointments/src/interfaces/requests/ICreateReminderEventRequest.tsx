import { ReminderEventType } from "../IReminderEvent";

export default interface ICreateReminderEventRequest {
    petId: string;
    userId: string;
    eventType: ReminderEventType;  // Use the enum type directly
  }