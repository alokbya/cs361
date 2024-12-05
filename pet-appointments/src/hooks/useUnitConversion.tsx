// src/hooks/useUnitConversion.ts
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { unitConversionService } from '../api/services/unitConversionService';
import type IUnitConversionRequest from '../interfaces/requests/IUnitConversionRequest';
import type IUnitConversionResponse from '../interfaces/responses/IUnitConversionResponse';

export const useUnitConversion = (): UseMutationResult<
  IUnitConversionResponse,
  Error,
  IUnitConversionRequest,
  unknown
> => {
  return useMutation({
    mutationFn: (params: IUnitConversionRequest) => 
      unitConversionService.convert(params),
    retry: false,
    networkMode: 'always',
    gcTime: 0,
  });
};