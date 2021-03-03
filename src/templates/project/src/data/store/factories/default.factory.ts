import { Factory, IArchive, IProperty, IPropertyIdentifier, Maybe, StoredEntity } from "clerk";
import { nanoid } from "nanoid";
import DefaultArchive from "../archives/default.archive";

export default class ArchitectDefaultFactory extends Factory {
  get defaultIdentifier(): IPropertyIdentifier {
    return {
      name: "_id",
      type: String,
      default: () => nanoid(),
      unique: true,
    };
  }
  private _archive = DefaultArchive;

  get archive(): IArchive {
    return this._archive;
  }

  hydrateEntity(entity: StoredEntity<unknown>): Maybe<StoredEntity<unknown>> {

    return entity;
  }
}
