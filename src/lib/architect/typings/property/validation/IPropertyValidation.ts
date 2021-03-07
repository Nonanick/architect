import type { IPropertyValidation as ClerkValidation} from 'clerk';

export interface IPropertyValidation extends ClerkValidation {
  title : string;
}