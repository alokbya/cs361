// src/api/services/userService.ts
import { apiClient } from '../client';
import type IUser from '../../interfaces/IUser';
import type ICreateUserRequest from '../../interfaces/requests/ICreateUserRequest';

export const userService = {
  getAll: async (): Promise<IUser[]> => {
    const response = await apiClient.get<IUser[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<IUser> => {
    const response = await apiClient.get<IUser>(`/users/${id}`);
    return response.data;
  },

  create: async (data: ICreateUserRequest): Promise<IUser> => {
    const response = await apiClient.post<IUser>('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ICreateUserRequest>): Promise<IUser> => {
    const response = await apiClient.put<IUser>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};