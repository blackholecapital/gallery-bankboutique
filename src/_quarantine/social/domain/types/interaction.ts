import type { UserId } from "./user";

export type InteractionId = string;
export type InteractionKind = "like" | "pass" | "match";

export interface Interaction {
  id: InteractionId;
  createdAt: string;
  updatedAt: string;
  actorUserId: UserId;
  targetUserId: UserId;
  kind: InteractionKind;
}
