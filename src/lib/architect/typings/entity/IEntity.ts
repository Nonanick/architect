import type { IEntity as ClerkEntity} from 'clerk';

export interface IEntity extends ClerkEntity {
  title : string;
  description? : string;
  icon? : string;
  
}