import type { IEntity } from 'clerk';
import type { IModelProcedureRequest } from 'clerk/dist/procedure/model/IModelProcedureRequest';
import { nanoid } from 'nanoid';
import { DefaultIdentifier } from './default.identifier';

export const ProjectEntity : IEntity = {
  name : 'project',
  identifier :DefaultIdentifier,
  properties : {
    name : {
      type : String,
      unique : true,
      required : true,
      isIdentifier : true,
    },
    title : {
      type : String,
      required : true,
      isDescriptive : true,
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
  },
  proxy : {
    "generate-unique-id-when-inserting" : {
      procedure : 'create',
      appliesTo : 'model',
      proxies:"request",
      async apply(req : IModelProcedureRequest) {
        req.model.set('_id', nanoid());
        return req;

      }, 
    }
  }
}