// src/interfaces/requests/IEmailRequest.ts
export interface IEmailRequest {
    subject: string;
    recipient_address: string;
    message: string;
  }