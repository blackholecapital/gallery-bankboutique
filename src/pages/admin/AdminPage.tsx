import { useMemo, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { useAdminDataset } from '@/admin-flow/hooks/useAdminDataset';
import { canActivateCard, getActiveCardCount } from '@/admin-flow/rules/packageLimit';
import type { GalleryCard } from '@/admin-flow/types';

function toOptional(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function createDraftCard(nextIndex: number, currency: string): GalleryCard {
  const now = new Date().toISOString();
  const id = `card-${nextIndex + 1}`;
  return {
    id,
    sku: `sku-${String(nextIndex + 1).padStart(4, '0')}`,
    title: `New Card ${nextIndex + 1}`,
    tagline: 'Short description',
    description: 'Full description',
    outcome: 'Expected outcome',
    bullets: ['Point one', 'Point two', 'Point three'],
    mainImage: {
      role: 'main',
      r2Key: '',
      alt: '',
    },
    thumbnail: {
      role: 'thumbnail',
      r2Key: '',
      alt: '',
    },
    media: [
      {
        id: `${id}-gallery-1`,
        role: 'gallery',
        orderIndex: 0,
        r2Key: '',
        alt: '',
      },
    ],
    cta: {
      kind: 'internal',
      label: 'View',
      internalPath: '/profile/new-card',
    },
    pricing: {
      setup: 0,
      monthly: 0,
      currency,
      interval: 'month',
      intervalLabel: 'mo',
      price: 0,
      trial: null,
      taxInclusive: false,
    },
    tags: [],
    badges: [],
    promoCode: null,
    promoDiscountPercent: null,
    status: 'draft',
    active: false,
    orderIndex: nextIndex,
    liveDemoUrl: null,
    videoDemoUrl: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function AdminPage() {
  const requiredCode = import.meta.env.VITE_ADMIN_CODE as string | undefined;

  const [code, setCode] = useState('');
  const [saved, setSaved] = useState<string | null>(null);
  const [cardMessage, setCardMessage] = useState<string | null>(null);
  const { dataset, setDataset, validation, source, save } = useAdminDataset();

  const sortedCards = useMemo(
    () => [...dataset.cards].sort((a, b) => a.orderIndex - b.orderIndex || a.title.localeCompare(b.title)),
    [dataset.cards],
  );
  const [selectedCardId, setSelectedCardId] = useState<string>(sortedCards[0]?.id ?? '');

  const selectedCard = useMemo(
    () => dataset.cards.find((card) => card.id === selectedCardId) ?? dataset.cards[0] ?? null,
    [dataset.cards, selectedCardId],
  );

  const accessGranted = useMemo(() => {
    if (!requiredCode) return true;
    return code.trim() === requiredCode.trim();
  }, [code, requiredCode]);

  const saveDataset = () => {
    const result = save(dataset, 'admin-ui-site-section');
    if (result.ok) {
      setSaved('Saved.');
      setCardMessage(null);
      setTimeout(() => setSaved(null), 1500);
      return;
    }
    setSaved('Save blocked by validation errors.');
  };

  const setSiteField = <K extends keyof typeof dataset.siteConfig>(key: K, value: (typeof dataset.siteConfig)[K]) => {
    setDataset((current) => ({
      ...current,
      siteConfig: {
        ...current.siteConfig,
        [key]: value,
      },
    }));
  };

  const setCommerceField = <K extends keyof typeof dataset.commerceConfig>(
    key: K,
    value: (typeof dataset.commerceConfig)[K],
  ) => {
    setDataset((current) => ({
      ...current,
      commerceConfig: {
        ...current.commerceConfig,
        [key]: value,
      },
    }));
  };

  const updateSelectedCard = (mutator: (card: GalleryCard) => GalleryCard) => {
    if (!selectedCard) return;
    setDataset((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === selectedCard.id ? { ...mutator(card), updatedAt: new Date().toISOString() } : card,
      ),
    }));
  };

  const createCard = () => {
    const nextOrder = dataset.cards.reduce((max, card) => Math.max(max, card.orderIndex), -1) + 1;
    const card = createDraftCard(nextOrder, dataset.siteConfig.defaultCurrency);
    setDataset((current) => ({
      ...current,
      cards: [...current.cards, card],
    }));
    setSelectedCardId(card.id);
    setCardMessage('Draft card created.');
  };

  const setCardActive = (nextActive: boolean) => {
    if (!selectedCard) return;
    if (nextActive) {
      const activationIssue = canActivateCard(dataset, selectedCard.id);
      if (activationIssue) {
        setCardMessage(`${activationIssue.ruleId}: ${activationIssue.message}`);
        return;
      }
    }

    updateSelectedCard((card) => ({
      ...card,
      status: nextActive ? 'active' : 'inactive',
      active: nextActive,
    }));
    setCardMessage(nextActive ? 'Card activated.' : 'Card deactivated.');
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4">
      <div>
        <p className="text-[16px] font-black text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">Admin</p>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Site-level configuration (schema-backed). Source: {source}.
        </p>
      </div>

      {requiredCode ? (
        <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
          <p className="text-[12px] font-bold text-slate-700">Access</p>
          <p className="mt-1 text-[12px] text-slate-500">Enter admin code to edit settings.</p>
          <input
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin code"
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
        <p className="text-[12px] font-bold text-slate-700">Business / Store</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.siteName} onChange={(e) => setSiteField('siteName', e.target.value)} placeholder="Site name" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.brandName} onChange={(e) => setSiteField('brandName', e.target.value)} placeholder="Brand name" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.heroTitle ?? ''} onChange={(e) => setSiteField('heroTitle', e.target.value)} placeholder="Hero title" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.tagline ?? ''} onChange={(e) => setSiteField('tagline', e.target.value)} placeholder="Tagline" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.customDomain ?? ''} onChange={(e) => setSiteField('customDomain', toOptional(e.target.value))} placeholder="Custom domain" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.contactEmail ?? ''} onChange={(e) => setSiteField('contactEmail', toOptional(e.target.value))} placeholder="Contact email" disabled={!accessGranted} />

          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.layoutMode} onChange={(e) => setSiteField('layoutMode', e.target.value as typeof dataset.siteConfig.layoutMode)} disabled={!accessGranted}>
            <option value="gallery">gallery</option>
            <option value="swipe">swipe</option>
            <option value="grid">grid</option>
          </select>

          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.siteConfig.packageTier} onChange={(e) => setSiteField('packageTier', e.target.value as typeof dataset.siteConfig.packageTier)} disabled={!accessGranted}>
            <option value="starter">starter</option>
            <option value="studio">studio</option>
            <option value="pro">pro</option>
            <option value="enterprise">enterprise</option>
            <option value="custom">custom</option>
          </select>

          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" type="number" min={0} max={500} value={dataset.siteConfig.packageCardLimit} onChange={(e) => setSiteField('packageCardLimit', Number(e.target.value) || 0)} placeholder="Package card limit" disabled={!accessGranted} />

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700">
            <input type="checkbox" checked={dataset.siteConfig.active} onChange={(e) => setSiteField('active', e.target.checked)} disabled={!accessGranted} />
            Site active
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
        <p className="text-[12px] font-bold text-slate-700">CTA / Checkout basics</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.commerceConfig.provider} onChange={(e) => setCommerceField('provider', e.target.value as typeof dataset.commerceConfig.provider)} disabled={!accessGranted}>
            <option value="payme">payme</option>
            <option value="stripe">stripe</option>
            <option value="placeholder">placeholder</option>
          </select>

          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.commerceConfig.mode} onChange={(e) => setCommerceField('mode', e.target.value as typeof dataset.commerceConfig.mode)} disabled={!accessGranted}>
            <option value="test">test</option>
            <option value="live">live</option>
          </select>

          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.commerceConfig.currency} onChange={(e) => setCommerceField('currency', e.target.value)} placeholder="Currency" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.commerceConfig.sourceApp} onChange={(e) => setCommerceField('sourceApp', e.target.value)} placeholder="Source app" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.commerceConfig.successUrlTemplate ?? ''} onChange={(e) => setCommerceField('successUrlTemplate', e.target.value)} placeholder="Success URL template" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={dataset.commerceConfig.cancelUrlTemplate ?? ''} onChange={(e) => setCommerceField('cancelUrlTemplate', e.target.value)} placeholder="Cancel URL template" disabled={!accessGranted} />
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] sm:col-span-2" value={dataset.commerceConfig.usdc.receiveAddress} onChange={(e) => setDataset((current) => ({ ...current, commerceConfig: { ...current.commerceConfig, usdc: { ...current.commerceConfig.usdc, receiveAddress: e.target.value } } }))} placeholder="USDC receive address" disabled={!accessGranted} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] font-bold text-slate-700">Card management (one-page)</p>
          <p className="text-[12px] text-slate-500">Active {getActiveCardCount(dataset)} / {dataset.siteConfig.packageCardLimit}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            className="min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]"
            value={selectedCard?.id ?? ''}
            onChange={(e) => setSelectedCardId(e.target.value)}
            disabled={!accessGranted}
          >
            {sortedCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.orderIndex} · {card.title} ({card.status})
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={createCard} disabled={!accessGranted}>Create draft card</Button>
        </div>

        {selectedCard ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={selectedCard.title} onChange={(e) => updateSelectedCard((card) => ({ ...card, title: e.target.value }))} placeholder="Title" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={selectedCard.sku} onChange={(e) => updateSelectedCard((card) => ({ ...card, sku: e.target.value }))} placeholder="SKU" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" type="number" value={selectedCard.pricing.setup} onChange={(e) => updateSelectedCard((card) => ({ ...card, pricing: { ...card.pricing, setup: Number(e.target.value) || 0, price: Number(e.target.value) || 0 } }))} placeholder="Price" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" type="number" value={selectedCard.orderIndex} onChange={(e) => updateSelectedCard((card) => ({ ...card, orderIndex: Number(e.target.value) || 0 }))} placeholder="Sort order" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] sm:col-span-2" value={selectedCard.tagline} onChange={(e) => updateSelectedCard((card) => ({ ...card, tagline: e.target.value }))} placeholder="Short description" disabled={!accessGranted} />
            <textarea className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] sm:col-span-2" value={selectedCard.description ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, description: e.target.value }))} placeholder="Full description" disabled={!accessGranted} rows={3} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] sm:col-span-2" value={selectedCard.mainImage.r2Key ?? selectedCard.mainImage.url ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, mainImage: { ...card.mainImage, r2Key: e.target.value, url: undefined } }))} placeholder="Main image field (r2Key/url)" disabled={!accessGranted} />

            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={selectedCard.thumbnail?.r2Key ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, thumbnail: { ...(card.thumbnail ?? { role: 'thumbnail' }), r2Key: e.target.value } }))} placeholder="Thumbnail field 1 (r2Key)" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={selectedCard.thumbnail?.url ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, thumbnail: { ...(card.thumbnail ?? { role: 'thumbnail' }), url: e.target.value } }))} placeholder="Thumbnail field 2 (url)" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" value={selectedCard.thumbnail?.alt ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, thumbnail: { ...(card.thumbnail ?? { role: 'thumbnail' }), alt: e.target.value } }))} placeholder="Thumbnail field 3 (alt)" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" type="number" value={selectedCard.thumbnail?.width ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, thumbnail: { ...(card.thumbnail ?? { role: 'thumbnail' }), width: Number(e.target.value) || undefined } }))} placeholder="Thumbnail field 4 (width)" disabled={!accessGranted} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" type="number" value={selectedCard.thumbnail?.height ?? ''} onChange={(e) => updateSelectedCard((card) => ({ ...card, thumbnail: { ...(card.thumbnail ?? { role: 'thumbnail' }), height: Number(e.target.value) || undefined } }))} placeholder="Thumbnail field 5 (height)" disabled={!accessGranted} />

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 sm:col-span-2">
              <input type="checkbox" checked={selectedCard.status === 'active'} onChange={(e) => setCardActive(e.target.checked)} disabled={!accessGranted} />
              Active (package-limit aware)
            </label>
          </div>
        ) : null}

        {cardMessage ? <p className="mt-2 text-[12px] font-semibold text-blue-700">{cardMessage}</p> : null}
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
        <div className="mt-1 flex gap-2">
          <Button onClick={saveDataset} disabled={!accessGranted}>Save admin dataset</Button>
          {saved ? <span className="ml-2 text-[12px] font-semibold text-emerald-700">{saved}</span> : null}
        </div>

        {!validation.ok ? (
          <ul className="mt-3 list-disc pl-5 text-[12px] text-rose-700">
            {validation.errors.slice(0, 8).map((issue) => (
              <li key={`${issue.ruleId}-${issue.path}`}>{issue.ruleId} {issue.path}: {issue.message}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
