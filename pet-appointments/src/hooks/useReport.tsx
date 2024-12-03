// src/hooks/useReport.ts
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/services/reportService';
import type { IFeedingReportRequest } from '../interfaces/requests/IFeedingReportRequest';

export const useFeedingReport = (params: IFeedingReportRequest) => {
  return useQuery({
    queryKey: ['feeding-report', params],
    queryFn: () => reportService.getFeedingReport(params),
    enabled: !!params.petId && !!params.startDate && !!params.endDate,
    // Don't refetch this data as frequently since it's historical
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};