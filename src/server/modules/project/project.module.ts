import path from "path";
import { performance} from 'perf_hooks';
import { promises as fs } from "fs";
import type { ProjectDTO } from "../../../lib/project/new-project.interface";
import { ProjectModule as ProjectLib } from "../../../lib/project/project.lib";
import { FileSystem } from "../../services/file-system/file-system.service";
import { exec } from 'child_process';

export const NodePackageManagers = {
  'yarn': {
    install: 'yarn',
    update: 'yarn update'
  },
  'npm': {
    install: 'npm i',
    update: 'npm update'
  },
  'pnpm': {
    install: 'pnpm install',
    update: 'pnpm update'
  },
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
  }

  return fs.writeFile(
    path.join(folder, "package.json"),
    JSON.stringify(newConfiguration, null, '\t')
  ).then(_ => {
    return `package.json in ${folder} was successfully updated with the new information!`;
  }).catch(err => {
    return new Error(`Failed to update package.json from ${folder}! ${err}`);
  })
}

export async function installProjectDependencies(
  manager: keyof typeof NodePackageManagers,
  project_root: string
) {
  let startTime = performance.now();
  let installCommandChild = exec(
    NodePackageManagers[manager].install,
    { windowsHide: true, cwd: project_root },
    (err, output, errOutput) => {
      console.log('callback fn:\nany error?', err, '\noutput',output, '\nerrors:', errOutput);
    }
  );

  let errorBuffer = "";
  let outputBuffer = "";
  installCommandChild.stdout.on("data", (data) => {
    outputBuffer += String(data);
  }); 
  installCommandChild.stderr.on("data", (data) => {
    errorBuffer += String(data);
  });

  return new Promise((resolve, reject) => {
    installCommandChild.on("exit", (code, signal) => {
      if (code === 0) {
        let endTime = performance.now();
        resolve(`All dependencies were installed sucessfully in ${(endTime - startTime)}ms\nOutput:\n${outputBuffer}`);
      } else {
        reject(
          `Package Manager failed ot install dependencies and resolved with code: "${code}"\nSTDERR output: ${errorBuffer}`
        );
      }
      console.log('Code: ', code, 'Signal', signal);
    });
  });

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

export const ProjectModule = {
  ...ProjectLib,
  createProjectManifest,
  copyEmptyProjectTemplate,
  copyArchitectMetadata,
  ArchitectProjectTemplatePath,
  configurePackageJsonFile,
  loadManifest,
  installProjectDependencies
};
