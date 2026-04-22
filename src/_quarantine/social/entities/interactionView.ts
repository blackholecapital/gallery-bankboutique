import type { InteractionKind } from '@/domain/types/interaction';

export function interactionKindLabel(kind: InteractionKind): string {
  if (kind === 'like') return 'Liked';
  if (kind === 'pass') return 'Passed';
  return 'Matched';
}
