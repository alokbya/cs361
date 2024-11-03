// src/types/api.ts (or wherever you keep your API types)
export interface IPetResponse {
    id: string;
    name: string;
    createdAt: string;
    userIds: string[];
}