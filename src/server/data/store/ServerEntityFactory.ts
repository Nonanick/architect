import {
  Entity,
  Factory,
  IArchive,
  IModelProcedure,
  IProperty,
  Maybe,
} from "clerk";
import {
  CreateEntity,
  CreateProcedure,
  DeleteProcedure,
  Synchronize,
  UpdateProcedure,
} from "clerk-sqlite";
import { nanoid } from "nanoid";
import { SQLiteArchive } from "./SQLiteArchive";

export class ServerEntityFactory extends Factory {
  get defaultIdentifier(): Pick<
    IProperty,
    | "name"
    | "type"
    | "isDescriptive"
    | "private"
    | "unique"
    | "default"
    | "validate"
    | "sanitize"
    | "proxy"
  > {
    return {
      name: "_id",
      type: String,
      default: nanoid(),
    };
  }

  get archive(): IArchive {
    return SQLiteArchive;
  }

  hydrateEntity(entity: Entity<{}>): Maybe<Entity<{}>> {

    entity.addEntityProcedure(
      CreateEntity,
      Synchronize,
    );

    entity.addModelProcedure(
      CreateProcedure,
      UpdateProcedure,
      DeleteProcedure,
    );

    return entity;
  }
}
