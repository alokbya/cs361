import IPet from '../../interfaces/IPet'
import ICreatePetRequest from '../../interfaces/requests/ICreatePetRequest'
import { apiClient } from '../client';

export const petService = {
  getAll: async (): Promise<IPet[]> => {
    const response = await apiClient.get<IPet[]>('/pets');
    return response.data;
  },

  getById: async (id: string): Promise<IPet> => {
    const response = await apiClient.get<IPet>(`/pets/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<IPet[]> => {
    const response = await apiClient.get<IPet[]>(`/pets/user/${userId}`);
    return response.data;
  },

  create: async (data: ICreatePetRequest): Promise<IPet> => {
    const response = await apiClient.post<IPet>('/pets', data);
    return response.data;
  },

  update: async (id: string, name: string): Promise<IPet> => {
    const response = await apiClient.put<IPet>(`/pets/${id}`, { name });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/pets/${id}`);
  },

  addUserToPet: async (petId: string, userId: string): Promise<IPet> => {
    const response = await apiClient.post<IPet>(`/pets/${petId}/users`, { userId });
    return response.data;
  },
};