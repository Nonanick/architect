import path from "path";
import { promises as fs } from "fs";
import type { ProjectManifest } from "./ProjectManifest";
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
  copyEmptyProjectTemplate,
  ArchitectTemplatePath,
  updateProjectFolder,
};
