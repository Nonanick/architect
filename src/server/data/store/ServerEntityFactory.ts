import { Entity, Factory, IArchive, IProperty, Maybe } from "clerk";
import { nanoid } from "nanoid";
import { SQLiteArchive } from './SQLiteArchive';

export class ServerEntityFactory extends Factory {

  get defaultIdentifier(): Pick<IProperty, "name" | "type" | "isDescriptive" | "private" | "unique" | "default" | "validate" | "sanitize" | "proxy"> {
    return {
      name: '_id',
      type: String,
      default: nanoid()
    };
  }

  get archive(): IArchive {
    return SQLiteArchive;
  }

  hydrateEntity(entity: Entity<{}>): Maybe<Entity<{}>> {
    return entity;
  }

}