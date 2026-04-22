import type { User } from '@/domain/types/user';
import { db } from '@/lib/db/client';

const now = new Date('2026-03-15T10:00:00.000Z').toISOString();

const demoUsers: User[] = [
  { id: '00-user-demo-owner', email: 'maya@factory-gallery.demo', isOnboarded: true, createdAt: now, updatedAt: now }
];

export async function ensureDemoData(): Promise<void> {
  const userCount = await db.users.count();
  if (userCount >= 1) return;

  await db.transaction('rw', db.users, async () => {
    for (const user of demoUsers) {
      await db.users.put(user);
    }
  });
}
