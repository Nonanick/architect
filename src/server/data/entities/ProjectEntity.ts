import type { IEntity } from 'clerk';
import { nanoid } from 'nanoid';

export const ProjectEntity : IEntity = {
  name : 'project',
  identifier : {
    name : '_id',
    type : String,
    default : () => nanoid(),
    unique : true,
  },
  properties : {
    name : {
      type : String,
      unique : true,
      required : true,
    },
    title : {
      type : String,
      required : true,
    },
    root : {
      type : String,
      required : true,
    },
    icon : String,
    description : String,
    version : String,
    author : String,
    created_at : {
      type : Date,
      default : () => new Date(),
    },
    metadata_root : String,
  }
}