export interface StorageAdapter {
  readText(path: string): Promise<string | null>;
  writeText(path: string, value: string): Promise<void>;
  remove(path: string): Promise<void>;
}

export interface StorageSnapshot {
  version: number;
  exportedAt: string;
  records: Record<string, unknown[]>;
}
