import { Entity, Factory, IPropertyIdentifier, Maybe } from "clerk";
import type { SQLite } from "clerk-sqlite";
import { nanoid } from "nanoid";

export class NewProjectFactory extends Factory {
  get defaultIdentifier(): IPropertyIdentifier {
    return {
      name: "_id",
      type: String,
      unique: true,
      private: true,
      default: () => nanoid(),
    };
  }

  hydrateEntity(ent: Entity): Maybe<Entity> {
    return ent;
  }

  constructor(public archive: SQLite) {
    super();
  }
}
