import { LocalAuthGateway } from '@/repositories/local/auth.local';
import type { AuthGateway } from '@/repositories/interfaces/AuthGateway';

export const authGateway: AuthGateway = new LocalAuthGateway();
