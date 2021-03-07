import path from "path";
import { promises as fs } from "fs";
import type { ProjectDTO } from "../../../lib/project/new-project.interface";
import { ProjectModule as ProjectLib } from "../../../lib/project/project.lib";
import { FileSystem } from "../../services/file-system/file-system.service";

async function createProjectManifest(
  manifestPath: string,
  info: ProjectDTO,
) {
  await fs.writeFile(
    manifestPath,
    Buffer.from(
      JSON.stringify(info),
    ),
    "binary",
  );
}

export const ArchitectProjectTemplatePath = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "templates",
  "project",
);

export const ArchitectMetadataTemplatePath = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "templates",
  "architect",
);

async function copyEmptyProjectTemplate(to: string) {
  return FileSystem.copyFolder(ArchitectProjectTemplatePath, to);
}

async function copyArchitectMetadata(to: string) {
  return FileSystem.copyFolder(ArchitectMetadataTemplatePath, to);
}

async function updateProjectFolder(
  folder: string,
  info: ProjectDTO,
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

async function loadManifest(path: string) {
  let data = await fs.readFile(path, { encoding: 'utf-8' });
  try {
    let manifestData = JSON.parse(data);
    return manifestData;
  } catch (err) {
    throw new Error("Failed to load manifest file!");
  }
}

export const ProjectService = {
  ...ProjectLib,
  createProjectManifest,
  copyEmptyProjectTemplate,
  copyArchitectMetadata,
  ArchitectProjectTemplatePath,
  updateProjectFolder,
  loadManifest
};
