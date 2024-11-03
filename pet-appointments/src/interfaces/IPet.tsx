// src/api/types.ts
export default interface IPet {
    id: string;  // GUIDs are strings in TypeScript
    name: string;
    createdAt: string;
    userIds: string[];
}