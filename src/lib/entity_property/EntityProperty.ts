import type { IEntity } from "clerk";

const EntityDefinition = <IEntity>{
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
} as const;

const EntityProperty = (() => ({ ...EntityDefinition } as const))();

export { EntityProperty };