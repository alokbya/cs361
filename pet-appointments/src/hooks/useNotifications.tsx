// src/hooks/useNotifications.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { emailService } from '../api/services/emailService';
import { userService } from '../api/services/userService';
import type { IEmailResponse, IEmailRequest } from '../interfaces/responses/IEmailResponse';
import type IUser from '../interfaces/IUser';

interface NotificationRequest {
  petName: string;
  petId: string;
  userIds: string[];
  currentUserId: string;
}

export const useSendNotification = () => {
  return useMutation({
    mutationFn: async ({ petName, userIds, currentUserId }: NotificationRequest) => {
      // Get all users' details
      const userPromises = userIds
        .filter(id => id !== currentUserId)
        .map(id => userService.getById(id));
      
      const users = await Promise.all(userPromises);
      const recipientEmails = users.map(user => user.email);

      if (recipientEmails.length === 0) {
        return; // No other users to notify
      }

      return emailService.sendFeedingNotification(petName, recipientEmails);
    },
  });
};