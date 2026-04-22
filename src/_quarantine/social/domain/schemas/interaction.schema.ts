import type { Interaction, InteractionKind } from "../types/interaction";
import {
  requireEnum,
  requireIsoDateTime,
  requireRecord,
  requireString,
  throwIfIssues,
} from "../validators";

const interactionKinds = ["like", "pass", "match"] as const satisfies readonly InteractionKind[];

export const interactionSchema = {
  parse(input: unknown): Interaction {
    const record = requireRecord(input, "Interaction");
    const issues: string[] = [];

    const entity: Interaction = {
      id: requireString(record.id, "Interaction.id", issues),
      createdAt: requireIsoDateTime(
        record.createdAt,
        "Interaction.createdAt",
        issues,
      ),
      updatedAt: requireIsoDateTime(
        record.updatedAt,
        "Interaction.updatedAt",
        issues,
      ),
      actorUserId: requireString(record.actorUserId, "Interaction.actorUserId", issues),
      targetUserId: requireString(record.targetUserId, "Interaction.targetUserId", issues),
      kind: requireEnum(record.kind, "Interaction.kind", interactionKinds, issues),
    };

    throwIfIssues(issues);
    return entity;
  },

  parseMany(input: unknown[]): Interaction[] {
    return input.map((item) => this.parse(item));
  },
};
