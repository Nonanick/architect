import type { IProperty } from "clerk";

export interface IArchitectEntityProperty extends IProperty {
  title: string;
  description?: string;

}