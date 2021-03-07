import { Entity, ModelOf } from 'clerk';
import { Controller, Resolver, Route } from "maestro";
import { CastObjectToEntityModel } from 'maestro-clerk';
import os from "os";
import path from "path";
import { ProjectEntity } from "../../../lib/entity/ProjectEntity";
import type { ProjectDTO } from "../../../lib/project/new_project.interface";
import { storage } from "../../data/store/ElectronStore";
import { FileSystem } from "../../services/file-system/file-system.service";
import { ConfigStore } from "../configuration/configuration.controller";
import ProjectSchema from "./project.schemas";
import { ArchitectProjectTemplatePath, ProjectService } from "./project.service";

export const ProjectDefaultFolderName = "architect-workspace";

export class ProjectController extends Controller {

  get baseURL(): string {
    return "project";
  }

  @Route({
    url: "create-folder",
    methods: "post",
    schema: ProjectSchema.CreateProjectFodler,
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

    return creation != null
      ? `OK! Directory '${folderPath}' was created successfully!`
      : new Error("Failed to create the folder!");
  };

  @Route({
    url: "default-workspace",
    schema: {
      response: {
        "2xx": { type: "string", },
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
        "2xx": { type: "string", },
      },
    },
  })
  public currentUser() {
    return os.userInfo().username;
  }

  @Route({
    url: "install-architect",
    methods: "post",
    schema: ProjectSchema.InstallArchitect,
  })
  public installArchitect: Resolver = async (req) => {
    return Promise.all([
      ProjectService.copyArchitectMetadata(path.join(req.get("target"), '.architect')),
      FileSystem.copyFolder(
        path.resolve(__dirname, '..', '..', '..', 'lib', 'architect', 'typings'),
        path.join(req.get("target"), '.architect', 'typings')
      )
    ])
      .then(_ => {
        return `Sucesfully copied architect metadata of '${ArchitectProjectTemplatePath}' into '${req.get('target')}'!`;
      }).catch(err => {
        return new Error(`Failed to copy architect metadata into '${req.get('target')}'!\n${err.message}`);
      });
  };

  @Route({
    url: "copy-template-project",
    methods: "post",
    schema: ProjectSchema.CopyTemplateProject,
  })
  public copyTemplateProject: Resolver = async (req) => {
    return ProjectService.copyEmptyProjectTemplate(req.get("target"))
      .then(_ => {
        return `Sucesfully copied '${ArchitectProjectTemplatePath}' into '${req.get('target')}'!`;
      }).catch(err => {
        return new Error(`Failed to copy template project into '${req.get('target')}'!\n${err.message}`);
      });
  };

  @Route({
    url: "configure-project",
    methods: ["post", "patch"],
    schema: ProjectSchema.ConfigureProject,
    cast: CastObjectToEntityModel(Entity.instance(ProjectEntity))
  })
  public configureProject: Resolver = async (req) => {
    let projectModel = <ModelOf<ProjectDTO>>req.byOrigin?.body;

    if (projectModel != null) {
      let info = await projectModel.$json<ProjectDTO>();
      let root = info.root;
      let configureProject = await ProjectService.configurePackageJsonFile(root, info);

      return configureProject;
    } else {
      return new Error("Failed to load project information!");
    }

  };

  @Route({
    url: "install-project-dependencies",
    methods: "post",
    schema: ProjectSchema.InstallDependencies
  })
  public installProjectDependencies: Resolver = async (req) => {
    let response = await ProjectService.installProjectDependencies(
      req.get('package_manager', 'body'),
      req.get('project_path')
    );

    return response;

  };

}
