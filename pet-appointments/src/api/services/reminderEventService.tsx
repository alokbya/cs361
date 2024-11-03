// src/api/services/reminderEventService.ts
import { apiClient } from '../client';
import IReminderEvent from '../../interfaces/IReminderEvent';
import { ReminderEventType } from '../../interfaces/IReminderEvent';

import ICreateReminderEventRequest from '../../interfaces/requests/ICreateReminderEventRequest';

export const reminderEventService = {
  getAll: async (): Promise<IReminderEvent[]> => {
    const response = await apiClient.get<IReminderEvent[]>('/reminderevents');
    return response.data;
  },

  getByPetId: async (petId: string): Promise<IReminderEvent[]> => {
    const response = await apiClient.get<IReminderEvent[]>(`/reminderevents/pet/${petId}`);
    return response.data;
  },

  getLatestByPetId: async (petId: string): Promise<IReminderEvent | null> => {
    const response = await apiClient.get<IReminderEvent[]>(`/reminderevents/pet/${petId}/latest`);
    return response.data[0] || null;
  },

  create: async (request: ICreateReminderEventRequest): Promise<IReminderEvent> => {
    const payload = {
      petId: request.petId,
      userId: request.userId,
      eventType: ReminderEventType[request.eventType]
    };
    
    const response = await apiClient.post<IReminderEvent>('/reminderevents', payload);
    return response.data;
  },
};

export default reminderEventService;