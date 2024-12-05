// src/interfaces/requests/IUnitConversionRequest.ts
export default interface IUnitConversionRequest {
    value: number;
    from: 'oz' | 'grams';
}
