// src/api/services/emailService.ts
import { SendNotificationRequest } from '../../interfaces/requests/ISendNotificationRequest';
import { emailClient } from '../emailClient';

export const emailService = {
  sendFeedingNotification: async (petName: string, recipientEmails: string[]) => {
    const notifications = recipientEmails.map(email => 
      emailClient.post('/email', {
        subject: `${petName} has been fed`,
        recipient_address: email,
        message: `${petName} was just fed. You can check the feeding history in the app.`
      } as SendNotificationRequest)
    );
    
    return Promise.all(notifications);
  }
};