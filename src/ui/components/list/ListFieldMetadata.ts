import type { IEntity } from "clerk";

export interface ListFieldMetadata {
  name: string;
  title: string;
  description: string;
  orderable?: boolean;
  position?: number;
  relative_size?: number;
  fields?: string[];
  pattern?: string;
  maskFunction?: FieldMaskFunction;
}

export type FieldMetadataOfEntity<T extends IEntity = IEntity> = {
  [name in keyof T['properties']]: ListFieldMetadata
};

export type FieldMaskFunction = (value: string) => any;