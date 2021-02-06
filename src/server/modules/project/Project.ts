import type { Dir } from 'fs';
import fs from 'fs/promises';

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
    let newFolder = await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.error("Failed to create directory!", err);
    return undefined;
  }
}