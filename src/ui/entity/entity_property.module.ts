import { EntityProperty } from "../../lib/entity_property/EntityProperty";
import type { FieldMetadataOfEntity, ListFieldMetadata } from "../components/list/ListFieldMetadata";

let EntityFormView: FieldMetadataOfEntity<typeof EntityProperty> = {
  "desc": {
    name: "description",
    description: "",
    title: "desc",
  }
};

export default {
  EntityProperty: {
    ...EntityProperty,
    ListViews: {
      EntityFormView
    }
  }
};