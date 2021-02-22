import type { IEntity } from 'clerk';

export interface IArchitectEntity extends IEntity {
  title : string;
  description? : string;
  icon? : string;
  
}