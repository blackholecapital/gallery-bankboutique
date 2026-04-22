import type { User } from '@/domain/types/user';

export function userInitials(user: User): string {
  const [name] = user.email.split('@');
  return name.slice(0, 2).toUpperCase();
}
