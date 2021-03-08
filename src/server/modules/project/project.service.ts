import path from "path";
import { performance } from 'perf_hooks';
import { promises as fs } from "fs";
import type { ProjectDTO } from "../../../lib/project/new_project.interface";
import { ProjectModule as ProjectLib } from "../../../lib/project/project.lib";
import { FileSystem } from "../../../lib/file_system/file-system.service";
import { exec as exec_command } from 'child_process';
import { Yarn } from './package_managers/Yarn';
import { NPM } from './package_managers/NPM';
import { PNPM } from './package_managers/PNPM';
import type { ExecOptions } from 'node:child_process';

export const NodePackageManagers = {
  'yarn': Yarn,
  'npm': NPM,
  'pnpm': PNPM,
} as const;

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
  await FileSystem.createFolder(to);
  return FileSystem.copyFolder(ArchitectProjectTemplatePath, to);
}

async function copyArchitectMetadata(to: string) {
  await FileSystem.createFolder(to);
  return FileSystem.copyFolder(ArchitectMetadataTemplatePath, to);
}

async function configurePackageJsonFile(
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

  console.log("Configuring package.json file: ", packageConfig);

  let newConfiguration = {
    ...packageConfig,
    name: info.name,
    author: info.author,
    version: info.version,
    description: info.description,
    architect: {
      ...info
    },
  };

  return fs.writeFile(
    path.join(folder, "package.json"),
    JSON.stringify(newConfiguration, null, '\t')
  ).then(_ => {
    return `package.json in ${folder} was successfully updated with the new information!`;
  }).catch(err => {
    return new Error(`Failed to update package.json from ${folder}! ${err}`);
  });
}

export async function installProjectDependencies(
  manager: keyof typeof NodePackageManagers,
  project_root: string
) {
  let startTime = performance.now();
  let outputBuffer = "";
  const PackageManager = NodePackageManagers[manager];
  return exec(
    PackageManager.install_dependencies,
    { windowsHide: true, cwd: project_root },
  ).then(output => {
    outputBuffer += "> Run package manager 'install':\n" + output;
    return exec(
      PackageManager.install_clerk,
      { windowsHide: true, cwd: project_root }
    )
  }).then(output => {
    outputBuffer += "> Install 'clerk' package:\n" + output;
    return exec(
      PackageManager.install_maestro,
      { windowsHide: true, cwd: project_root }
    )
  }).then(output => {
    outputBuffer += "> Install 'maestro' package:\n" + output;
    let endTime = performance.now();
    return Promise.resolve(
      `All dependencies were installed sucessfully in ${((endTime - startTime)/1000).toFixed(4)}s\nOutput:\n${outputBuffer}`
    );
  }).catch(([err, errOutput]) => {
    return Promise.reject(
      `Package Manager failed ot install dependencies!"${err.message}"\nSTDERR output: ${errOutput}`
    );
  });

}

async function exec(command: string, options: ExecOptions = {}): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec_command(command, options, (err, output, errorOutput) => {
      if (err != null) {
        reject([err, errorOutput]);
      }
      resolve(output);
    });
  })

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
  configurePackageJsonFile,
  loadManifest,
  installProjectDependencies
};
