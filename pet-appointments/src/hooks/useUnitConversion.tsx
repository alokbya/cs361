// useUnitConversion.ts
import { useQuery } from '@tanstack/react-query';
import { unitConversionService } from '../api/services/unitConversionService';

export const useUnitConversion = (value: number, from: 'oz' | 'grams') => {
    return useQuery({
        queryKey: ['unitConversion', value, from],
        queryFn: () => unitConversionService.convert({ value, from }),
        enabled: value > 0, // Only run query if we have a positive value
    });
};