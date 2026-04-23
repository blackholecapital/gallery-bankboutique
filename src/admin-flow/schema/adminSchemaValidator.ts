import { SCHEMA_VERSION } from '@/admin-flow/constants';
import { validatePackageLimit } from '@/admin-flow/rules/packageLimit';
import type { AdminDataset, ValidationIssue, ValidationResult } from '@/admin-flow/types';

const ROOT_KEYS = ['siteConfig', 'cards', 'commerceConfig', 'meta'] as const;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pushError(list: ValidationIssue[], ruleId: string, path: string, message: string): void {
  list.push({ ruleId, path, message, severity: 'error' });
}

function pushWarning(list: ValidationIssue[], ruleId: string, path: string, message: string): void {
  list.push({ ruleId, path, message, severity: 'warning' });
}

export function validateAdminDataset(dataset: AdminDataset): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const keys = Object.keys(dataset as object);
  if (keys.length !== ROOT_KEYS.length || ROOT_KEYS.some((key) => !(key in dataset))) {
    pushError(errors, 'R-ROOT-01', '/', 'Dataset must contain exactly siteConfig, cards, commerceConfig, and meta.');
  }

  if (!/^[A-Z]{3}$/.test(dataset.siteConfig.defaultCurrency)) {
    pushError(errors, 'R-SITE-05', '/siteConfig/defaultCurrency', 'defaultCurrency must be ISO-4217 uppercase code.');
  }

  if (!Number.isInteger(dataset.siteConfig.packageCardLimit) || dataset.siteConfig.packageCardLimit < 0 || dataset.siteConfig.packageCardLimit > 500) {
    pushError(errors, 'R-LIMIT-01', '/siteConfig/packageCardLimit', 'packageCardLimit must be an integer between 0 and 500.');
  }

  const idSet = new Set<string>();
  const skuSet = new Set<string>();
  const slugSet = new Set<string>();
  const orderSet = new Set<number>();

  dataset.cards.forEach((card, index) => {
    const path = `/cards/${index}`;

    if (idSet.has(card.id)) pushError(errors, 'R-CARD-04', `${path}/id`, 'Card id must be unique.');
    idSet.add(card.id);

    if (skuSet.has(card.sku)) pushError(errors, 'R-CARD-05', `${path}/sku`, 'Card sku must be unique.');
    skuSet.add(card.sku);

    const slug = slugify(card.title);
    if (!slug) pushError(errors, 'R-CARD-06', `${path}/title`, 'Card title is required.');
    if (slugSet.has(slug)) pushError(errors, 'R-CARD-06', `${path}/title`, 'Card title slug must be unique.');
    slugSet.add(slug);

    if (card.bullets.length < 3 || card.bullets.length > 8) {
      pushError(errors, 'R-CARD-07', `${path}/bullets`, 'Card bullets must contain between 3 and 8 entries.');
    }

    if (card.media.length < 1 || card.media.length > 20) {
      pushError(errors, 'R-CARD-10', `${path}/media`, 'Card media must contain between 1 and 20 entries.');
    }

    if (orderSet.has(card.orderIndex)) {
      pushError(errors, 'R-CARD-22', `${path}/orderIndex`, 'Card orderIndex must be unique.');
    }
    orderSet.add(card.orderIndex);

    const activeMirror = card.status === 'active';
    if (card.active !== activeMirror) {
      pushError(errors, 'R-CARD-21', `${path}/active`, 'Card active must mirror status.');
    }

    const promoCodeSet = Boolean(card.promoCode);
    const promoPercentSet = card.promoDiscountPercent !== null && card.promoDiscountPercent !== undefined;
    if (promoCodeSet !== promoPercentSet) {
      pushError(errors, 'R-CARD-19', `${path}/promoCode`, 'promoCode and promoDiscountPercent must be both set or both null.');
    }

    if (card.cta.kind === 'internal' && !card.cta.internalPath) {
      pushError(errors, 'R-CARD-14', `${path}/cta/internalPath`, 'internalPath required when cta.kind is internal.');
    }
    if (card.cta.kind === 'external' && !card.cta.externalUrl) {
      pushError(errors, 'R-CARD-14', `${path}/cta/externalUrl`, 'externalUrl required when cta.kind is external.');
    }

    const roleOrderPairs = new Set<string>();
    let mainCount = 0;
    let thumbCount = 0;

    card.media.forEach((media, mediaIndex) => {
      const mediaPath = `${path}/media/${mediaIndex}`;
      const hasUrl = Boolean(media.url);
      const hasR2 = Boolean(media.r2Key);

      if (hasUrl === hasR2) {
        pushError(errors, 'R-CARD-10', mediaPath, 'Exactly one of media.url or media.r2Key is required.');
      }

      const roleOrderKey = `${media.role}:${media.orderIndex}`;
      if (roleOrderPairs.has(roleOrderKey)) {
        pushError(errors, 'R-CARD-12', `${mediaPath}/orderIndex`, 'media.orderIndex must be unique per role.');
      }
      roleOrderPairs.add(roleOrderKey);

      if (media.role === 'main') mainCount += 1;
      if (media.role === 'thumbnail') thumbCount += 1;
    });

    if (mainCount > 1) pushError(errors, 'R-CARD-11', `${path}/media`, 'At most one media item with role=main is allowed.');
    if (thumbCount > 1) pushError(errors, 'R-CARD-11', `${path}/media`, 'At most one media item with role=thumbnail is allowed.');

    if (!card.thumbnail && card.status === 'active') {
      pushWarning(warnings, 'R-VAL-03', `${path}/thumbnail`, 'Active card has no thumbnail.');
    }
  });

  errors.push(...validatePackageLimit(dataset));

  if (dataset.meta.schemaVersion !== SCHEMA_VERSION) {
    pushError(errors, 'R-META-02', '/meta/schemaVersion', `meta.schemaVersion must be ${SCHEMA_VERSION}.`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
