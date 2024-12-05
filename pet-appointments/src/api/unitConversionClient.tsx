// unitConversionClient.ts
import axios from 'axios';

export const unitConversionClient = axios.create({
    baseURL: 'http://localhost:3027',
    headers: {
        'Content-Type': 'application/json',
    }
});

unitConversionClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Unit Conversion API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Types for the unit conversion
export interface IUnitConversionRequest {
    value: number;
    from: 'oz' | 'grams';
}

export interface IUnitConversionResponse {
    originalValue: number;
    originalUnit: string;
    convertedValue: number;
    convertedUnit: string;
}