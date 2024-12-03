// src/api/services/reportService.ts
import { reportClient } from '../reportClient';
import type { IFeedingReportRequest } from '../../interfaces/requests/IFeedingReportRequest';
import type { IFeedingReportResponse } from '../../interfaces/responses/IFeedingReportResponse';

export const reportService = {
    getFeedingReport: async (params: IFeedingReportRequest): Promise<IFeedingReportResponse> => {
        const response = await reportClient.get<IFeedingReportResponse>('/api/feeding-report', {
            params: {
                ...params,
                format: 'json'
            }
        });
        return response.data;
    },

    downloadFeedingReport: async (params: IFeedingReportRequest & { petName: string }): Promise<void> => {
        const response = await reportClient.get('/api/feeding-report', {
            params: {
                ...params,
                format: 'html'
            },
            responseType: 'blob'
        });

        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `feeding-report-${params.petName}-${params.startDate}.html`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};