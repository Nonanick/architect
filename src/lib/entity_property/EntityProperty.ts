import { Entity } from "clerk";

const EntityDefinition = Entity.define({
  name: 'new prop',
  properties: {
    name: {
      type: String,
      unique: true,
      isDescriptive: true,
      private: false,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
  }
});


export { EntityDefinition as EntityProperty };