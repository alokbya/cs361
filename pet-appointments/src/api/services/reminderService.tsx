import { apiClient } from '../client';
import IReminderEvent from '../../interfaces/IReminderEvent';
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

  create: async (data: ICreateReminderEventRequest): Promise<IReminderEvent> => {
    const response = await apiClient.post<IReminderEvent>('/reminderevents', data);
    return response.data;
  },
};