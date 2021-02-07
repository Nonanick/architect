import { nanoid } from 'nanoid';
import { FileSystem } from '../../server/services/file-system/file-system.service';
import type { Server } from './interfaces/server/server.service';
import { NodeServer } from "./node/server/node_server.service";

export let ArchitectServices = {
  FileSystem,
  Server: NodeServer
}

export const MyWorld = nanoid();

export function SetArchitectServer(server : Server) {
  ArchitectServices.Server = server;
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