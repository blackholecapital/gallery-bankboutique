export type UserId = string;

export interface User {
  id: UserId;
  createdAt: string;
  updatedAt: string;
  email: string;
  isOnboarded: boolean;
}
