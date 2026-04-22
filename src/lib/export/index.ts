import type { StorageSnapshot } from "../storage";

export interface ExportService {
  exportSnapshot(): Promise<StorageSnapshot>;
}

export interface ImportService {
  importSnapshot(snapshot: StorageSnapshot): Promise<void>;
}
