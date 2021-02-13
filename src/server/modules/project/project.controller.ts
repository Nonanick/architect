import os from "os";
import path from "path";
import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";
import { ConfigStore } from "../configuration/configuration.controller";
import { ProjectModule } from "./project.module";
import { FileSystem } from "../../services/file-system/file-system.service";
import { ProjectEntity } from "../../data/entities/ProjectEntity";
import type { ProjectInterface } from "../../../lib/project/new-project.interface";
import { Entity } from 'clerk';

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
    return "OK!";
  };

  @Route({
    url: "install-database",
    methods: "post",
    schema: {
      body: {
        type: "object",
        properties: {
          target: {
            type: "string",
          },
          filename: {
            type: "string",
            default: "@{folderName}.sqlite",
          },
        },
        required: ["target"],
      },
    },
  })
  public installArchitectDatabase: Resolver = async (req) => {
    return "OK!";
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
    return "OK!";
  };

  @Route({
    url: "configure-project",
    methods: ["post", "patch"],
    schema: {
      body: {
        type: "object",
        properties: {
          target: { type: "string" },
          name: { type: "string" },

          icon: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },

          version: { type: "string" },
          author: { type: "string" },
          created_at: { type: "string" },
        },
      },
    },
  })
  public configureProject: Resolver = async (req) => {
    return "OK!";
  };

  @Route({
    url: "install-project-dependencies",
    methods: "post",
  })
  public installProjectDependencies: Resolver = async (req) => {
  };

  @Route({
    url: "save-project",
    methods: "post",
    schema: {
      body: {
        type: "object",
        required: ["name", "title", "root"],
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          root: { type: "string" },
          metadata_root: { type: "string" },
          icon: { type: "string" },
          version: { type: "string" },
          author: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  })
  public saveProject: Resolver = async (req) => {
    let model = Entity.instance(ProjectEntity).model<
      ProjectInterface
    >();
    model.$set(
      req.get(
        ["name", "title", "root", "metadata_root", "icon", "version", "author"],
      ),
    );

    let values = await model.$commit(true);

    if (values instanceof Error) {
      return values;
    }

    console.log("[Project-Controller]: Commited values", values);

    let projects: any[] = storage("projects").get("tracked") as any[] ?? [];
    projects.push(values);
    storage("projects").set("tracked", projects);

    console.log("[Project-Controller]: Tracked projects", projects);
    return values;
  };

  @Route({
    url : 'tracked-projects'
  })
  public trackedProjects : Resolver = () => {
    let allProjects : any[] =  storage("projects").get("tracked") as any[] ?? [];
    if(allProjects.length > 10) {
      allProjects = allProjects.slice(allProjects.length-10);
      storage("projects").set("tracked", allProjects);
    }
    return allProjects.reverse();
  }

  @Route({
    url : 'tracked-projects',
    methods : 'delete'
  })
  public emptyTrackedProjects : Resolver = () => {
    storage("projects").set("tracked", []);
    return 'Ok! Erased all tracked projects';
  }
}
