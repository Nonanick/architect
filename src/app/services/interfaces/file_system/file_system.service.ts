import type { Dirent } from "fs";
import type { FolderTracker } from './folder_tracker.interface';

export interface FileSystem {
  folderInfo(path: string): Promise<Dirent[] | undefined>;
  createFolder(path: string): Promise<string | undefined>;
  removeFolder(path: string): Promise<boolean>;
  copyFolder(from: string, to: string): Promise<void>;
  joinPath(...paths: string[]): string;
  resolvePath(...paths: string[]): string;
  fileExists(path : string) : Promise<boolean>;
  trackFolder(path : string) : Promise<FolderTracker>;
}
