import type { Interaction } from "../../domain/types/interaction";
import type { UserId } from "../../domain/types/user";

export interface InteractionRepository {
  listByActor(actorUserId: UserId): Promise<Interaction[]>;
  save(interaction: Interaction): Promise<Interaction>;
}
