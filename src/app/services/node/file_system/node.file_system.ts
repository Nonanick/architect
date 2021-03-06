import { FileSystem } from "../../../../lib/file_system/file-system.service";
import type { FileSystem as FSInterface } from "../../interfaces/file_system/file_system.service";
import { ipcRenderer, IpcRendererEvent, OpenDialogReturnValue, shell } from "electron";
import { nanoid } from "nanoid";

export const NodeFileSystem: FSInterface & {
  pickFolder(initialDir?: string): Promise<string>;
  displayFolder(path : string) : Promise<void>;
} = {
  ...FileSystem,
  async pickFolder(initialDir? : string) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let requestId = nanoid();

      let listener = (
        ev: IpcRendererEvent,
        success: boolean,
        id: string,
        locationOrError: OpenDialogReturnValue,
      ) => {
        if (id !== requestId) return;

        console.log(
          `[FileSystem]: Response for dialog request ${requestId} was ${success} &&
            ${locationOrError.canceled} - path: ${locationOrError.filePaths[0]}`,
        );

        if (success === true && locationOrError.canceled === false) {
          resolve(locationOrError.filePaths[0]);
        } else {
          reject(locationOrError);
        }

        ipcRenderer.on("pick-folder-response", listener);
      };

      ipcRenderer.on("pick-folder-response", listener);

      ipcRenderer.send("pick-folder", requestId, initialDir);
    });
  },

  async displayFolder(path : string) {
    shell.openPath(path);
  }
};
