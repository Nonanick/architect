import { Entity } from "clerk";
import type { RouteSchema } from "maestro"
import { SchemaFromEntity } from "maestro-clerk";
import { ProjectEntity } from "../../../lib/entity/ProjectEntity";

const OpenMetadataJsonFileFromProjectRoot: RouteSchema = {
  body: {
    type: 'object',
    required: ['root'],
    properties: {
      root: { type: 'string' }
    },
    additionalProperties: false,
  },
  response: {
    '2xx': SchemaFromEntity(Entity.instance(ProjectEntity)),
    '404': {
      type: 'object',
      properties: { message: { type: 'string' }, }
    },
    '5xx': { type: 'string' }
  }
};

const AnalyzeFilesFromProjectSource : RouteSchema = {
  body : {
    type :'object',
    required : ['src'],
    properties : {
      src : {
        type : 'string'
      },
      categories : {
        type :'array',
        items : {
          type : 'string'
        }
      }
    },
    additionalProperties : false
  }
};

export default {
  OpenMetadataJsonFileFromProjectRoot,
  AnalyzeFilesFromProjectSource
}