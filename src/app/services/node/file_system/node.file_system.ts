import { FileSystem } from "../../../../server/services/file-system/file-system.service";
import type { FileSystem as FSInterface } from "../../interfaces/file_system/file_system.service";
import { ipcRenderer, IpcRendererEvent, OpenDialogReturnValue, shell } from "electron";
import { nanoid } from "nanoid";

export const NodeFileSystem: FSInterface & {
  pickFolder(): Promise<String>;
  displayFolder(path : string) : Promise<void>;
} = {
  ...FileSystem,
  async pickFolder() : Promise<String> {
    return new Promise<String>((resolve, reject) => {
      let requestId = nanoid();

      let listener = (
        ev: IpcRendererEvent,
        success: boolean,
        id: string,
        locationOrError: OpenDialogReturnValue,
      ) => {
        if (id !== requestId) return;

        console.log(
          `[FileSystem]: Response for dialog request ${requestId} was ${success &&
            locationOrError.canceled} - path: ${locationOrError.filePaths[0]}`,
        );

        if (success === true && locationOrError.canceled === false) {
          resolve(locationOrError.filePaths[0]);
        } else {
          reject(locationOrError);
        }

        ipcRenderer.on("pick-folder-response", listener);
      };

      ipcRenderer.on("pick-folder-response", listener);

      ipcRenderer.send("pick-folder", requestId);
    });
  },

  async displayFolder(path : string) {
    shell.openPath(path);
  }
};
