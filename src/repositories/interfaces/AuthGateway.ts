import type { User, UserId } from "../../domain/types/user";

export interface AuthGateway {
  getCurrentUser(): Promise<User | null>;
  signInWithEmail(email: string): Promise<User>;
  signOut(): Promise<void>;
  markOnboarded(userId: UserId): Promise<User>;
}
