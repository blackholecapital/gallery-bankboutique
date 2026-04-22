import { userSchema } from '../../domain/schemas/user.schema';
import type { User, UserId } from '../../domain/types/user';
import type { AuthGateway } from '../interfaces/AuthGateway';
import { db } from '../../lib/db/client';

const SESSION_USER_KEY = 'artist-connect.session.userId';

function getStoredSessionUserId(): UserId | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_USER_KEY);
}

function setStoredSessionUserId(userId: UserId | null): void {
  if (typeof window === 'undefined') return;

  if (userId) {
    window.localStorage.setItem(SESSION_USER_KEY, userId);
    return;
  }

  window.localStorage.removeItem(SESSION_USER_KEY);
}

export class LocalAuthGateway implements AuthGateway {
  async getCurrentUser(): Promise<User | null> {
    const sessionUserId = getStoredSessionUserId();

    if (sessionUserId) {
      const sessionUser = await db.users.get(sessionUserId);
      if (sessionUser) return userSchema.parse(sessionUser);
      setStoredSessionUserId(null);
    }

    return null;
  }

  async signInWithEmail(email: string): Promise<User> {
    const now = new Date().toISOString();

    const existing = await db.users.where('email').equals(email).first();
    if (existing) {
      const parsed = userSchema.parse({
        ...existing,
        updatedAt: now
      });
      await db.users.put(parsed);
      setStoredSessionUserId(parsed.id);
      return parsed;
    }

    const entity = userSchema.parse({
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      email,
      isOnboarded: false
    });

    await db.users.put(entity);
    setStoredSessionUserId(entity.id);
    return entity;
  }

  async signOut(): Promise<void> {
    setStoredSessionUserId(null);
  }

  async markOnboarded(userId: UserId): Promise<User> {
    const current = await db.users.get(userId);

    if (!current) {
      throw new Error(`User not found: ${userId}`);
    }

    const updated = userSchema.parse({
      ...current,
      isOnboarded: true,
      updatedAt: new Date().toISOString()
    });

    await db.users.put(updated);
    setStoredSessionUserId(updated.id);
    return updated;
  }
}
