import os from "os";
import path from "path";
import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";
import { ConfigStore } from "../configuration/configuration.controller";
import { ProjectModule, ArchitectProjectTemplatePath } from "./project.module";
import { FileSystem } from "../../services/file-system/file-system.service";
import { ProjectEntity } from "../../../lib/entity/ProjectEntity";
import type { ProjectDTO } from "../../../lib/project/new-project.interface";
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
    return ProjectModule.copyArchitectMetadata( path.join( req.get("target"), '.architect' ) )
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
    //return ProjectModule.updateProjectFolder
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
      ProjectDTO
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


    let projects: any[] = storage("projects").get("tracked") as any[] ?? [];
    projects.push(values);
    storage("projects").set("tracked", projects);

    return values;
  };

  @Route({
    url: 'tracked'
  })
  public trackedProjects: Resolver = () => {
    let allProjects: any[] = storage("projects").get("tracked") as any[] ?? [];
    if (allProjects.length > 10) {
      allProjects = allProjects.slice(allProjects.length - 10);
    }
    return allProjects.reverse();
  }

  @Route({
    url: 'tracked/:name'
  })
  public getTrackedProject: Resolver = (req) => {
    let allProjects = storage('projects').get('tracked') as any[];
    let project = allProjects.filter(project => project.name === req.get('name'));
    if (project.length > 0) {
      return project[0];
    } else {
      return new Error(`Could not find project with name '${req.get('name')}' on the tracked projects`);
    }
  };


  @Route({
    url: 'tracked',
    methods: 'delete'
  })
  public emptyTrackedProjects: Resolver = () => {
    storage("projects").set("tracked", []);
    return 'Ok! Erased all tracked projects';
  }

  @Route({
    url: 'tracked/:name',
    methods: 'delete'
  })
  public removeFromTrackedProjects: Resolver = (req) => {
    let allProjects = storage('projects').get('tracked') as any[];
    let oldLength = allProjects.length;
    allProjects = allProjects.filter(project => project.name != req.get('name'));
    storage('projects').set('tracked', allProjects);
    return `Removed ${oldLength - allProjects.length} projects with name '${req.get('name')}'`;
  }

  @Route({
    url : 'analyze',
    methods : 'post',
    schema : {
      body : {
        type : 'object',
        required : ['target'],
        properties : {
          target : { type : 'string' }
        }
      }
    }
  })
  public analyzeProjectFolder : Resolver = (req) => {
    let manifest = ProjectModule.loadManifest(
      path.join( req.get('target'), '.architect','manifest.json')
    );

    return manifest;
  };
}
