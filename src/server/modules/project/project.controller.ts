import os from "os";
import path from "path";
import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";
import { ConfigStore } from "../configuration/configuration.controller";
import { ProjectModule } from "./project.module";
import { FileSystem } from '../../services/file-system/file-system.service';

export const ProjectDefaultFolderName = "architect-workspace";

export class ProjectController extends Controller {
  get baseURL(): string {
    return "project";
  }

  @Route({
    url: "create",
    methods: "post",
    schema: {
      body: {
        type: "object",
        required: ["identifier"],
        properties: {
          "identifier": {
            type: "string",
          },
          "workspace": {
            type: "string",
          },
        },
      },
    },
  })
  public create: Resolver = async (req) => {
    const currentDate = new Date(Date.now());
    const projectIdentifier = req.get("identifier");

    const projectTitle = req.get("title") ??
      ProjectModule.convertPackageNameToTitle(String(projectIdentifier));

    const projectWorkspace = req.get("workspace") ??
      storage(ConfigStore).get("workspace") ??
      path.join(os.homedir(), ProjectDefaultFolderName);

    console.log(
      "Will create project a",
      projectIdentifier,
      "with title",
      projectTitle,
      "on folder",
      projectWorkspace,
      "with author - ",
      this.currentUser(),
      "on date",
      currentDate,
    );

   /* await ProjectModule.createProject({
      name: projectIdentifier,
      icon: req.get("icon"),
      title: req.get("title"),
      description: req.get("description") ?? "",
      version: req.get("version", "0.0.1"),
      author: this.currentUser(),
      created_at: new Date(Date.now()),
      folder_name: ProjectModule.convertPackageNameToFolderPath(projectIdentifier),
      root: projectWorkspace,
    });*/

    return `Will create project ${projectIdentifier} with title ${projectTitle} on folder ${projectWorkspace} with author - ${this.currentUser()} on date ${currentDate}`;
  };

  @Route({
    url: "create-folder",
    methods: "post",
    schema: {
      body: {
        type: "object",
        properties: {
          path: {
            type: "string",
            minLength: 3,
          },
        },
      },
    },
  })
  public createFolder: Resolver = async (req) => {
    let folderPath = req.get("path");
    let alreadyExists = await FileSystem.folderInfo(folderPath);

    if (alreadyExists != undefined) {
      if (alreadyExists.length > 0) {
        return new Error("Choosen directory already exists and its not empty!");
      } else {
        return "OK! Directory already existed and it's empty! NOOP";
      }
    }

    let creation = await FileSystem.createFolder(folderPath);

    return creation != null
      ? `OK! Directory '${folderPath}' was created successfully!`
      : "Failed to create the folder!";
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
    return os.userInfo().username + "!";
  }
}
