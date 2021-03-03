import { EntityProperty } from "../../../lib/entity_property/EntityProperty";
import type { FieldMetadataOfEntity, ListFieldMetadata } from "../../components/list/ListFieldMetadata";

let EntityFormView: FieldMetadataOfEntity<typeof EntityProperty> = {
  name: {
    title: "Name",
    description: "Human readable title of the entity property",
  },
  title: {
    title: "Title",
    description: ""
  },
  description: {
    title: "Description",
    description: "Detailed information about the property purpose or what kind of information it holds",
  },
};

export default {
  EntityProperty: {
    ...EntityProperty,
    ListViews: {
      EntityFormView
    }
  }
};