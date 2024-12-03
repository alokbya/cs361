// src/interfaces/responses/IFeedingReportResponse.ts
export interface IFeedingReportResponse {
    petId: string;
    period: {
      start: string;
      end: string;
    };
    events: Array<{
      id: string;
      eventType: string;
      eventTime: string;
      userName: string;
      petName: string;
    }>;
  }