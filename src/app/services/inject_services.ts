import { NodeFileSystem } from "./node/file_system/node_file_system.service";
import { NodeServer } from "./node/server/node_server.service";

export const ArchitectServices = {
  FileSystem: NodeFileSystem,
  Server: NodeServer
} as const;

export type WithServices<T> = T & {
  ArchitectServices: typeof ArchitectServices;
};

export function InjectServices(target: { [name: string]: any; } & {}): WithServices<typeof target> {

  target.ArchitectServices = ArchitectServices;

  return target as WithServices<typeof target>;
}