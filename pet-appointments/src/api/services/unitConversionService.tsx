import { IUnitConversionRequest, IUnitConversionResponse, unitConversionClient } from "../unitConversionClient";

// unitConversionService.ts
export const unitConversionService = {
    convert: async ({ value, from }: IUnitConversionRequest): Promise<IUnitConversionResponse> => {
        const response = await unitConversionClient.get<IUnitConversionResponse>('/api/convert', {
            params: { value, from }
        });
        return response.data;
    }
};