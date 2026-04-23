import fixtureDataset from '@/admin-flow/fixtures/gallery_schema_example_v1.json';
import type { AdminDataset } from '@/admin-flow/types';

export const ADMIN_DATASET_STORAGE_KEY = 'artist-connect.admin.dataset.v1';
export const SCHEMA_VERSION = 'gallery-schema-v1';

export const DEFAULT_ADMIN_DATASET: AdminDataset = {
  ...(fixtureDataset as AdminDataset),
  meta: {
    ...(fixtureDataset as AdminDataset).meta,
    schemaVersion: SCHEMA_VERSION,
  },
};
