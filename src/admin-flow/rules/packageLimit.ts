import type { AdminDataset, ValidationIssue } from '@/admin-flow/types';

export function getActiveCardCount(dataset: AdminDataset): number {
  return dataset.cards.filter((card) => card.status === 'active').length;
}

export function validatePackageLimit(dataset: AdminDataset): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  const activeCount = getActiveCardCount(dataset);
  const limit = dataset.siteConfig.packageCardLimit;

  if (activeCount > limit) {
    errors.push({
      ruleId: 'R-LIMIT-02',
      path: '/cards',
      message: `Active card count (${activeCount}) exceeds packageCardLimit (${limit}).`,
      severity: 'error',
    });
  }

  return errors;
}

export function canActivateCard(dataset: AdminDataset, cardId: string): ValidationIssue | null {
  const card = dataset.cards.find((item) => item.id === cardId);
  if (!card) {
    return {
      ruleId: 'C-LIMIT-02',
      path: '/cards',
      message: `Card not found: ${cardId}`,
      severity: 'error',
    };
  }

  if (card.status === 'active') return null;

  const activeCount = getActiveCardCount(dataset);
  if (activeCount >= dataset.siteConfig.packageCardLimit) {
    return {
      ruleId: 'C-LIMIT-02',
      path: `/cards/${cardId}/status`,
      message: 'Cannot activate card: package card limit reached.',
      severity: 'error',
    };
  }

  return null;
}

export function canLowerPackageLimit(dataset: AdminDataset, nextLimit: number): ValidationIssue | null {
  const activeCount = getActiveCardCount(dataset);
  if (nextLimit < activeCount) {
    return {
      ruleId: 'C-LIMIT-03',
      path: '/siteConfig/packageCardLimit',
      message: `Cannot set packageCardLimit to ${nextLimit} while ${activeCount} cards are active.`,
      severity: 'error',
    };
  }

  return null;
}
