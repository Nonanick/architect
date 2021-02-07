import os from "os";
import path from "path";
import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";
import { ConfigStore } from "../configuration/configuration.controller";
import { createProject } from "./Project";

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
      this.convertToTitle(String(projectIdentifier));

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

    await createProject({
      name: projectIdentifier,
      icon: req.get("icon"),
      title: req.get("title"),
      description: req.get("description") ?? "",
      version : req.get("version","0.0.1"),
      author: this.currentUser(),
      created_at: new Date(Date.now()),
      folder_name: this.convertToFolderName(projectIdentifier),
      root: projectWorkspace,
    });

    return `Will create project ${projectIdentifier} with title ${projectTitle} on folder ${projectWorkspace} with author - ${this.currentUser()} on date ${currentDate}`;
  };

  private convertToFolderName(identifier: string) {
    return identifier
      .replace(/[^A-z0-9\-\_\.\/\\]/g, "")
      .replace(/\.\.|\.\/|\.\\/g, "")
      .toLocaleLowerCase();
  }

  private convertToTitle(str: string) {
    return str.split(/[\-_]/).map((pieces) =>
      pieces.charAt(0).toLocaleUpperCase() + pieces.substr(1)
    ).join(" ").replace(/([A-Z])/g, " $1");
  }

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
