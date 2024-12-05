// src/hooks/useUnitConversion.ts
import { useMutation } from '@tanstack/react-query';
import { unitConversionService } from '../api/services/unitConversionService';
import type IUnitConversionRequest from '../interfaces/requests/IUnitConversionRequest';

export const useUnitConversion = () => {
  return useMutation({
    mutationFn: (params: IUnitConversionRequest) => 
      unitConversionService.convert(params),
  });
};