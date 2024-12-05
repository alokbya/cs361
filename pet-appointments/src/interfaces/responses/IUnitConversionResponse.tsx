// src/interfaces/responses/IUnitConversionResponse.ts
export default interface IUnitConversionResponse {
    originalValue: number;
    originalUnit: string;
    convertedValue: number;
    convertedUnit: string;
}