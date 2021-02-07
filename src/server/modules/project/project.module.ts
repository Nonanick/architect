import path from "path";
import { promises as fs } from "fs";
import type { ProjectManifest } from "./ProjectManifest";
import { CreateEntity, SQLite } from "clerk-sqlite";
import * as NewProjectEntities from "./new-project-entities";
import { NewProjectFactory } from "./NewProjectFactory";
import { IEntityProcedureRequest, Store } from "clerk";
import type { NewProject } from "../../../lib/project/new-project.interface";
import { ProjectModule as ProjectLib } from "../../../lib/project/project.lib";
import { FileSystem } from "../../services/file-system/file-system.service";

async function createProjectManifest(
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

async function createProjectDatabase(dbFilename: string) {
  let sqlite = new SQLite(dbFilename);
  let newProjectFactory = new NewProjectFactory(sqlite);
  let newStore = new Store(newProjectFactory);

  newStore.add(
    ...(Object.entries(NewProjectEntities).map(([k, v]) => v)),
  );

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

async function copyEmptyProjectTemplate(to: string) {
  console.log("Will now copy project template: ", ArchitectTemplatePath);
  return FileSystem.copyFolder(ArchitectTemplatePath, to);
}

async function updateProjectFolder(
  folder: string,
  info: NewProject,
) {
  // Update package.json
  let packageConfig = JSON.parse(
    await fs.readFile(
      path.join(folder, "package.json"),
      { encoding: "utf-8" },
    ),
  );

  packageConfig.name = info.name, packageConfig.author = info.author;
  packageConfig.version = info.version;
}

async function createProject(info: NewProject) {
  let projectDirPath = path.resolve(
    info.root,
    info.folder_name,
  );

  // 1 - Create the folder structure inside the workspace

  await FileSystem.createFolder(projectDirPath);
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
      FileSystem.createFolder(path.join(projectDirPath, innerFolder)),
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

export const ProjectModule = {
  ...ProjectLib,
  createProjectManifest,
  createProjectDatabase,
  copyEmptyProjectTemplate,
  ArchitectTemplatePath,
  updateProjectFolder,
};
