// src/api/services/portionCalculatorService.ts
import { IPortionRequest } from '../../interfaces/requests/IPortionRequest';
import { IPortionResponse } from '../../interfaces/responses/IPortionResponse';
import { portionCalculatorClient } from '../portionCalculatorClient';

export const portionCalculatorService = {
    calculatePortion: async (data: IPortionRequest): Promise<IPortionResponse> => {
      const response = await portionCalculatorClient.post<IPortionResponse>('/api/calculate-portion', data);
      return response.data;
    }
  };

export default portionCalculatorService;