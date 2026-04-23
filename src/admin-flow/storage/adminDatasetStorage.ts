import { ADMIN_DATASET_STORAGE_KEY, DEFAULT_ADMIN_DATASET } from '@/admin-flow/constants';
import { normalizeAdminDataset } from '@/admin-flow/normalizers/adminDatasetNormalizer';
import { validateAdminDataset } from '@/admin-flow/schema/adminSchemaValidator';
import type { AdminDataset, LoadResult, ValidationResult } from '@/admin-flow/types';

const LEGACY_ADMIN_DATASET_STORAGE_KEY = 'admin.gallery.dataset.v1';

function sortKeysDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeysDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    const sortedEntries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => [key, sortKeysDeep(nested)]);
    return Object.fromEntries(sortedEntries) as T;
  }

  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value), null, 2);
}

function resolveStoredDatasetRaw(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    window.localStorage.getItem(ADMIN_DATASET_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_ADMIN_DATASET_STORAGE_KEY)
  );
}

export function loadAdminDataset(): LoadResult {
  const fallback = normalizeAdminDataset(DEFAULT_ADMIN_DATASET);

  const raw = resolveStoredDatasetRaw();
  if (!raw) {
    return {
      dataset: fallback,
      validation: validateAdminDataset(fallback),
      source: 'default',
    };
  }

  try {
    const parsed = JSON.parse(raw);
    const dataset = normalizeAdminDataset(parsed);
    return {
      dataset,
      validation: validateAdminDataset(dataset),
      source: 'storage',
    };
  } catch {
    const validation = validateAdminDataset(fallback);
    validation.errors.unshift({
      severity: 'error',
      ruleId: 'C-LOAD-01',
      path: '/',
      message: 'Stored admin dataset is invalid JSON; using fixture dataset.',
    });

    return {
      dataset: fallback,
      validation,
      source: 'default',
    };
  }
}

export function saveAdminDataset(dataset: AdminDataset, updatedBy = 'admin'): ValidationResult {
  const normalized = normalizeAdminDataset(dataset);
  normalized.meta.updatedAt = new Date().toISOString();
  normalized.meta.updatedBy = updatedBy;
  normalized.meta.source = 'admin';

  const validation = validateAdminDataset(normalized);
  if (!validation.ok || typeof window === 'undefined') {
    return validation;
  }

  window.localStorage.setItem(ADMIN_DATASET_STORAGE_KEY, stableStringify(normalized));
  return validation;
}

export function serializeAdminDataset(dataset: AdminDataset): string {
  return stableStringify(normalizeAdminDataset(dataset));
}
