import { WorkerIPCClient } from 'maestro-electron';
import { getCurrentWorker } from '../app.server.boot';
import type { Server } from './interfaces/server/server.service';
import { NodeFileSystem } from "./node/file_system/node_file_system.service";
import { NodeServer } from "./node/server/node_server.service";

let useServer : Server = NodeServer;
let FS = NodeFileSystem;

export function SetServerService(server : Server) {
  useServer = server;
}

export function ArchitectServices()  {
  return { 
    FileSystem: NodeFileSystem,
    Server: useServer
  }
};

export type WithServices<T> = T & {
  ArchitectServices: ReturnType<typeof ArchitectServices>
};

export function InjectServices(target: { [name: string]: any; } & {}): WithServices<typeof target> {

  target.ArchitectServices = ArchitectServices();
  target.Architect = ArchitectServices();
  
  if(process.argv.includes('--dev')) {
    target.Architect.Server = new WorkerIPCClient(getCurrentWorker()!);
  }
  
  ArchitectServices().Server.start();

  return target as WithServices<typeof target>;
}