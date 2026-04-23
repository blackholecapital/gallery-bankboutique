import { useCallback, useState } from 'react';
import { loadAdminDataset, saveAdminDataset } from '@/admin-flow/storage/adminDatasetStorage';
import type { AdminDataset, ValidationResult } from '@/admin-flow/types';

export function useAdminDataset() {
  const initial = loadAdminDataset();
  const [dataset, setDataset] = useState<AdminDataset>(initial.dataset);
  const [validation, setValidation] = useState<ValidationResult>(initial.validation);
  const [source, setSource] = useState(initial.source);

  const reload = useCallback(() => {
    const next = loadAdminDataset();
    setDataset(next.dataset);
    setValidation(next.validation);
    setSource(next.source);
  }, []);

  const save = useCallback(
    (next: AdminDataset, updatedBy?: string) => {
      const result = saveAdminDataset(next, updatedBy);
      setValidation(result);
      if (result.ok) {
        setDataset(next);
        setSource('storage');
      }
      return result;
    },
    [],
  );

  return {
    dataset,
    setDataset,
    validation,
    source,
    reload,
    save,
  };
}
