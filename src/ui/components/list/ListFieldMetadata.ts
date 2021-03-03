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

export type FieldMetadataOfEntity<T extends IEntity> = {
  [name in keyof T['properties']]: Omit<ListFieldMetadata, "name">
};

export type FieldMaskFunction = (value: string) => any;