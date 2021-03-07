import { Entity } from "clerk";
import type { RouteSchema } from "maestro"
import { SchemaFromEntity } from "maestro-clerk";
import { ProjectEntity } from "src/lib/entity/ProjectEntity";
import { NodePackageManagers } from "./project.service";

const InstallDependencies: RouteSchema = {
    body: {
        type: 'object',
        required: ['package_manager', 'project_path'],
        properties: {
            package_manager: {
                type: 'string',
                enum: Object.keys(NodePackageManagers),
                default: Object.keys(NodePackageManagers)[0]
            },
            project_path: {
                type: 'string',
            }
        },
        additionalProperties: false,
    }
};

const ConfigureProject: RouteSchema = {
    body: SchemaFromEntity(Entity.instance(ProjectEntity)),
}

const CopyTemplateProject: RouteSchema = {
    body: {
        type: "object",
        required: ["target"],
        properties: {
            target: {
                type: "string",
            },
        },
    },
};

const InstallArchitect : RouteSchema = {
    body: {
      type: "object",
      properties: {
        target: {
          type: "string",
        },
        folderName: {
          type: "string",
          default: ".architect",
        },
      },
      required: ["target"],
    },
  };

  const CreateProjectFodler : RouteSchema = {
    body: {
      type: "object",
      required: ["target"],
      properties: {
        target: {
          type: "string",
          minLength: 3,
        },
      },
    },
  };

export default {
    InstallDependencies,
    ConfigureProject,
    CopyTemplateProject,
    InstallArchitect,
    CreateProjectFodler
}