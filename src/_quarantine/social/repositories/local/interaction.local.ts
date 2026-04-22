import { interactionSchema } from "../../domain/schemas/interaction.schema";
import type { Interaction } from "../../domain/types/interaction";
import type { UserId } from "../../domain/types/user";
import { db } from "../../lib/db/client";
import type { InteractionRepository } from "../interfaces/InteractionRepository";

export class LocalInteractionRepository implements InteractionRepository {
  async listByActor(actorUserId: UserId): Promise<Interaction[]> {
    const interactions = await db.interactions
      .where("actorUserId")
      .equals(actorUserId)
      .toArray();

    return interactionSchema.parseMany(interactions);
  }

  async save(interaction: Interaction): Promise<Interaction> {
    const entity = interactionSchema.parse(interaction);
    await db.interactions.put(entity);
    return entity;
  }
}
