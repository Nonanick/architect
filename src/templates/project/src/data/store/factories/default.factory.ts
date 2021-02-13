import { Factory, IArchive, IProperty, Maybe, StoredEntity } from "clerk";
import { nanoid } from "nanoid";

export default class ArchitectDefaultFactory extends Factory {
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
      default: () => nanoid(),
      unique: true,
    };
  }
  get archive(): IArchive {
    throw new Error("Method not implemented.");
  }
  hydrateEntity(entity: StoredEntity<unknown>): Maybe<StoredEntity<unknown>> {
    throw new Error("Method not implemented.");
  }
}
