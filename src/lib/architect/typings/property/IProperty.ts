import type { IProperty as ClerkProperty } from "clerk";

export interface IProperty extends ClerkProperty {
  title: string;
  description?: string;

}