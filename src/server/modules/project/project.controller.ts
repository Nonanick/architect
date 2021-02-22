import os from "os";
import path from "path";
import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";
import { ConfigStore } from "../configuration/configuration.controller";
import { ProjectModule, ArchitectProjectTemplatePath } from "./project.module";
import { FileSystem } from "../../services/file-system/file-system.service";
import { ProjectEntity } from "../../../lib/entity/ProjectEntity";
import type { ProjectDTO } from "../../../lib/project/new-project.interface";
import { Entity, ModelOf } from 'clerk';
import { CastObjectToEntityModel, SchemaFromEntity } from 'maestro-clerk';

export const ProjectDefaultFolderName = "architect-workspace";

export class ProjectController extends Controller {

  get baseURL(): string {
    return "project";
  }

  @Route({
    url: "create-folder",
    methods: "post",
    schema: {
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
    },
  })
  public createFolder: Resolver = async (req) => {
    let folderPath = req.get("target");
    let alreadyExists = await FileSystem.folderInfo(folderPath);

    if (alreadyExists != undefined) {
      if (alreadyExists.length > 0) {
        return new Error("Choosen directory already exists and its not empty!");
      } else {
        return "Sone! Directory already existed but it's empty! Using it as project root folder!";
      }
    }

    let creation = await FileSystem.createFolder(folderPath);
    console.log("[ProjectController]", creation);

    return creation != null
      ? `OK! Directory '${folderPath}' was created successfully!`
      : new Error("Failed to create the folder!");
  };

  @Route({
    url: "default-workspace",
    schema: {
      response: {
        "2xx": {
          type: "string",
        },
      },
    },
  })
  public defaultWorkspace: Resolver = () => {
    return storage(ConfigStore).get("workspace") ??
      path.join(os.homedir(), ProjectDefaultFolderName);
  };

  @Route({
    url: "current-user",
    schema: {
      response: {
        "2xx": {
          type: "string",
        },
      },
    },
  })
  public currentUser() {
    return os.userInfo().username;
  }

  @Route({
    url: "install-architect",
    methods: "post",
    schema: {
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
    },
  })
  public installArchitect: Resolver = async (req) => {
    return Promise.all([
      ProjectModule.copyArchitectMetadata(path.join(req.get("target"), '.architect')),
      FileSystem.copyFolder(
        path.resolve(__dirname, '..', '..', '..', 'lib', 'typings'),
        path.join(req.get("target"), '.architect', 'typings')
      )
    ])
      .then(_ => {
        return `Sucesfully architect metadata of '${ArchitectProjectTemplatePath}' into '${req.get('target')}'!`;
      }).catch(err => {
        return new Error(`Failed to copy architect metadata into '${req.get('target')}'!\n${err.message}`);
      });
  };

  @Route({
    url: "copy-template-project",
    methods: "post",
    schema: {
      body: {
        type: "object",
        required: ["target"],
        properties: {
          target: {
            type: "string",
          },
        },
      },
    },
  })
  public copyTemplateProject: Resolver = async (req) => {
    return ProjectModule.copyEmptyProjectTemplate(req.get("target"))
      .then(_ => {
        return `Sucesfully copied '${ArchitectProjectTemplatePath}' into '${req.get('target')}'!`;
      }).catch(err => {
        return new Error(`Failed to copy template project into '${req.get('target')}'!\n${err.message}`);
      });
  };

  @Route({
    url: "configure-project",
    methods: ["post", "patch"],
    schema: {
      body: SchemaFromEntity(Entity.instance(ProjectEntity)),
    },
    cast: CastObjectToEntityModel(Entity.instance(ProjectEntity))
  })
  public configureProject: Resolver = async (req) => {
    let projectModel = <ModelOf<ProjectDTO>>req.byOrigin?.body;

    if (projectModel != null) {
      console.log("Received and casted body props to model of entity!\n", projectModel);
    }

    return "OK!";
  };

  @Route({
    url: "install-project-dependencies",
    methods: "post",
  })
  public installProjectDependencies: Resolver = async (req) => {
  };


  @Route({
    url: 'analyze',
    methods: 'post',
    schema: {
      body: {
        type: 'object',
        required: ['target'],
        properties: {
          target: { type: 'string' }
        }
      }
    }
  })
  public analyzeProjectFolder: Resolver = async (req) => {
    try {
      let manifest = await ProjectModule.loadManifest(
        path.join(req.get('target'), '.architect', 'manifest.json')
      );

      console.log('Project Manifest file: ', manifest);

      return manifest;
    } catch (err) {
      console.error("[ProjectController] Faile to reach projects manifest!", err);
      return new Error("Failed to reach project's manifest!");
    }
  };
}
