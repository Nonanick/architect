import type { Dirent } from 'fs';
import chokidar from 'chokidar';
import { promises as fs } from 'fs';
import path from 'path';
import type { FolderTracker } from '../../app/services/interfaces/file_system/folder_tracker.interface';

async function folderInfo(path: string): Promise<Dirent[] | undefined> {
  try {
    let info = await fs.readdir(path, { withFileTypes: true });
    return info;
  } catch (err) {
    return undefined;
  }
}

async function createFolder(path: string): Promise<string | undefined> {
  try {
    return await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.error("Failed to create directory!", err);
    return undefined;
  }
}

async function removeFolder(folderPath: string): Promise<boolean> {
  return true;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    let fInfo = await fs.stat(path);
    if (fInfo.isFile()) return true;
  } catch (err) {

  } finally {
    return false;
  }
}

async function copyFolder(from: string, to: string) {

  try {
    let readDir = await fs.readdir(
      from,
      { withFileTypes: true },
    );

    for (let subitem of readDir) {

      if (subitem.isDirectory()) {
        let folderPath = path.join(from, subitem.name);
        let destinationFolder = path.join(to, subitem.name);

        FileSystem.createFolder(destinationFolder)
          .then((_) => {
            copyFolder(folderPath, destinationFolder);
          })
          .catch(err => {
            throw new Error("Failed to copy folder subdirectory, could not recreate folder structure in targeted folder!" + err.message)
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
  } catch (err) {
    throw new Error("Failed to read source directory " + from + " to be copied into " + to + "!\n" + err.message);
  }
}

function joinPath(...pieces: string[]) {
  return path.join(...pieces);
}

function resolvePath(...pieces: string[]) {
  return path.resolve(...pieces);
}

async function trackFolder(
  root: string,
  extensions: string[] = ['ts', 'js', 'json']
): Promise<FolderTracker> {
  let fsWatcher = chokidar.watch(
    extensions.map(ext => `**/*.${ext}`),
    {
      cwd: root,
      ignoreInitial: true,
      followSymlinks: true,
      ignored: "**/node_modules/**/*"
    });

    console.log("should restart app and server!");
  return {
    stop: () => {
      return fsWatcher.close();
    },
    on: fsWatcher.on,
    off: fsWatcher.off
  };
}

export const FileSystem = {
  folderInfo,
  createFolder,
  removeFolder,
  copyFolder,
  joinPath,
  resolvePath,
  fileExists,
  trackFolder
}