// src/hooks/useReminderEvents.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderEventService } from '../api/services/reminderEventService';
import ICreateReminderEventRequest from '../interfaces/requests/ICreateReminderEventRequest';

export const useReminderEvents = (petId: string) => {
  return useQuery({
    queryKey: ['reminderEvents', petId],
    queryFn: () => reminderEventService.getByPetId(petId),
    enabled: !!petId,
  });
};

export const useCreateReminderEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreateReminderEventRequest) => 
      reminderEventService.create(request),
    onSuccess: (_, { petId }) => {
      queryClient.invalidateQueries({ queryKey: ['reminderEvents', petId] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

export const useLatestReminderEvent = (petId: string) => {
  return useQuery({
    queryKey: ['reminderEvents', petId, 'latest'],
    queryFn: () => reminderEventService.getLatestByPetId(petId),
    enabled: !!petId,
  });
};