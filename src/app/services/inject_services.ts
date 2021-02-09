import { dialog, ipcRenderer } from 'electron';
import { FileSystem } from '../../server/services/file-system/file-system.service';
import { NodeServer } from "./node/server/node_server.service";

export let ArchitectServices = {
  FileSystem : {
    ...FileSystem,
    async pickFolder() {
      return new Promise<String>((resolve, reject) => {
        ipcRenderer.once("pick-folder-response",(ev, success, locationOrError) => {
          console.log("Response!", success, locationOrError);
           if(success === true && locationOrError.canceled === false) {
             resolve(locationOrError.filePaths[0]);
           } else {
             reject(locationOrError);
           } 
        });
        ipcRenderer.send("pick-folder");
      });
     

    }
  },
  Server: NodeServer
}

export type WithServices<T> = T & {
  ArchitectServices: typeof ArchitectServices
};

export function InjectServices(target: { [name: string]: any; } & {}): WithServices<typeof target> {

  target.ArchitectServices = ArchitectServices;
  target.Architect = ArchitectServices;
  
  ArchitectServices.Server.start();

  return target as WithServices<typeof target>;
}