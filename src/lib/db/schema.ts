export const DB_NAME = 'xyz-labs-prototype';
export const DB_VERSION = 1;

export const dbSchema = {
  users: '&id, email, createdAt, updatedAt'
} as const;

export type TableName = keyof typeof dbSchema;
