// src/hooks/usePortionCalculator.ts
import { useMutation } from '@tanstack/react-query';
import { portionCalculatorService } from '../api/services/portionCalculatorService';

interface PortionCalculatorParams {
  weight: number;
  age: number;
  id: string;
}

export const usePortionCalculator = () => {
  return useMutation({
    mutationFn: (params: PortionCalculatorParams) => 
      portionCalculatorService.calculatePortion(params)
  });
};