import path from "path";
import { promises as fs } from "fs";
import type { ProjectManifest } from "./ProjectManifest";
import { CreateEntity, SQLite } from "clerk-sqlite";
import * as NewProjectEntities from "./new-project-entities";
import { NewProjectFactory } from "./NewProjectFactory";
import { IEntityProcedureRequest, Store } from "clerk";
import type { ProjectInterface } from "../../../lib/project/new-project.interface";
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
  info: ProjectInterface,
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

export const ProjectModule = {
  ...ProjectLib,
  createProjectManifest,
  createProjectDatabase,
  copyEmptyProjectTemplate,
  ArchitectTemplatePath,
  updateProjectFolder,
};
