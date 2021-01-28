import * as fs from "tauri/api/fs";

function openArchitectProject(folderPath: string) {
}

export const FileSystem = { 
  ...fs, 
  openArchitectProject 
};
