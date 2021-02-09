import type { Dir, Dirent } from "fs";

export interface FileSystem {
  folderInfo(path: string): Promise<Dirent[] | undefined>;
  createFolder(path: string): Promise<Dir | undefined>;
  removeFolder(path: string): Promise<boolean>;
  copyFolder(from: string, to: string): Promise<void>;
  joinPath(...paths: string[]): string;
  resolvePath(...paths: string[]): string;
}
