import Dexie, { type EntityTable } from 'dexie';
import type { User } from '../../domain/types/user';
import { registerMigrations } from './migrations';
import { DB_NAME, DB_VERSION, dbSchema } from './schema';

export class AppDexie extends Dexie {
  users!: EntityTable<User, 'id'>;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores(dbSchema);
    registerMigrations(this);
  }
}

export const db = new AppDexie();
