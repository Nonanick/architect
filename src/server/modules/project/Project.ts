import type { Dir } from "fs";
import path from "path";
import { promises as fs } from "fs";
import type { NewProjectInfo } from "./NewProjectInfo";
import type { ProjectManifest } from "./ProjectManifest";
import { CreateEntity, SQLite } from "clerk-sqlite";
import { Entity, Version } from "./new-project-entities";
import { EntityFlow } from "./new-project-entities/EntityFlow";
import { EntityFlowStep } from "./new-project-entities/EntityFlowStep";
import { EntityProperty } from "./new-project-entities/EntityProperty";
import { ModelProcedure } from "./new-project-entities/ModelProcedure";
import { ModelValidation } from "./new-project-entities/ModelValidation";
import { Page } from "./new-project-entities/Page";
import { PageEngine } from "./new-project-entities/PageEngine";
import { PropertyValidation } from "./new-project-entities/PropertyValidation";
import { StoreArchive } from "./new-project-entities/StoreArchive";
import { StoreBinding } from "./new-project-entities/StoreBinding";
import { NewProjectFactory } from "./NewProjectFactory";
import { IEntityProcedureRequest, Store } from "clerk";
import { EntityProcedure } from "./new-project-entities/EntityProcedure";

export async function folderInfo(path: string): Promise<Dir | undefined> {
  try {
    let info = await fs.opendir(path);
    return info;
  } catch (err) {
    return undefined;
  }
}

export async function createFolder(path: string): Promise<Dir | undefined> {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.error("Failed to create directory!", err);
    return undefined;
  }
}

export async function removeFolder(folderPath: string): Promise<boolean> {
  return true;
}

export function convertToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[@]/g, "")
    .replace(/\//g, "-")
    .split(/[\/\-_]/)
    .map((pieces) => pieces.charAt(0).toLocaleUpperCase() + pieces.substr(1))
    .join(" ");
}

export async function createProjectManifest(
  manifestPath: string,
  info: ProjectManifest,
) {
  await fs.writeFile(
    manifestPath,
    Buffer.from(
      JSON.stringify(info),
    ),
    "binary",
  );
}

const NewProjectEntities = [
  Entity,
  EntityFlow,
  EntityFlowStep,
  EntityProcedure,
  EntityProperty,
  ModelProcedure,
  ModelValidation,
  Page,
  PageEngine,
  PropertyValidation,
  StoreArchive,
  StoreBinding,
  Version,
];

export async function createProjectDatabase(dbFilename: string) {
  let sqlite = new SQLite(dbFilename);
  let newProjectFactory = new NewProjectFactory(sqlite);
  let newStore = new Store(newProjectFactory);

  newStore.add(...NewProjectEntities);

  console.log("Creating project db structure!");

  for (let entity of newStore.allEntities()) {
    let createRequest: IEntityProcedureRequest = {
      context: {},
      entity,
      procedure: "create-entity",
    };

    let response = await CreateEntity.execute(sqlite, createRequest);
    console.log(response);
  }
}

const ArchitectTemplatePath = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "templates",
  "project",
);

export async function copyEmptyProjectTemplate(to: string) {
  console.log("Will now copy project template: ", ArchitectTemplatePath);
  return copyFolder(ArchitectTemplatePath, to);
}

export async function copyFolder(from: string, to: string) {
  let readDir = await fs.readdir(
    from,
    { withFileTypes: true },
  );

  for (let subitem of readDir) {
    if (subitem.isDirectory()) {
      let folderPath = path.join(from, subitem.name);
      let destinationFolder = path.join(to, subitem.name);
      createFolder(destinationFolder).then((_) => {
        copyFolder(folderPath, destinationFolder);
      });
    }

    if (subitem.isFile()) {
      fs.copyFile(path.join(from, subitem.name), path.join(to, subitem.name));
    }

    if (subitem.isSymbolicLink()) {
      let linkPath = await fs.readlink(path.join(from, subitem.name));
      fs.symlink(linkPath, path.join(to, subitem.name));
    }
  }
}

export async function updateProjectFolder(
  folder: string,
  info: NewProjectInfo,
) {
  // Update package.json
  let packageConfig = JSON.parse(
    await fs.readFile(
      path.join(folder, "package.json"),
      { encoding: "utf-8" },
    ),
  );

  packageConfig.name = info.name,
  packageConfig.author = info.author;
  packageConfig.version = info.version;

}

export async function createProject(info: NewProjectInfo) {
  let projectDirPath = path.resolve(
    info.root,
    info.folder_name,
  );

  // 1 - Create the folder structure inside the workspace

  await createFolder(projectDirPath);
  let innerFolderCreated: Promise<any>[] = [];

  for (
    let innerFolder of [
      ".architect/db",
      ".architect/scripts",
      ".architect/versions",
      ".architect/migrations",
    ]
  ) {
    innerFolderCreated.push(
      createFolder(path.join(projectDirPath, innerFolder)),
    );
  }

  await Promise.all(innerFolderCreated);

  // 2 - Build/copy the template files inside it

  try {
    await createProjectManifest(
      path.join(projectDirPath, ".architect", ".manifest"),
      {
        icon: info.icon,
        name: info.name,

        description: info.description,
        title: info.title,

        author: info.author,
        created_at: info.created_at,
        last_updated: new Date(Date.now()),

        database: path.join(
          projectDirPath,
          "architect",
          "db",
          info.folder_name + ".sqlite",
        ),
        version: "0.0.1",
      },
    );
  } catch (err) {
    console.error("Failed to create manifest file", err);
  }

  try {
    await copyEmptyProjectTemplate(
      projectDirPath,
    );
  } catch (err) {
    console.error("Failed to create project template", err);
  }

  // 3 - Generate a project SQLite database for it
  await createProjectDatabase(
    path.join(projectDirPath, ".architect", "db", info.folder_name + ".sqlite"),
  );

  // 4 - Update files with project info
  await updateProjectFolder(
    projectDirPath,
    info,
  );

  // 5 - Run build tools

  // 6 - Test it
}
