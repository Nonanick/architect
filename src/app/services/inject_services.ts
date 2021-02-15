import { Buffer } from 'buffer';
import { NodeFileSystem } from './node/file_system/node.file_system';
import { NodeServer } from "./node/server/node.server";

export let ArchitectServices = {
  FileSystem: NodeFileSystem,
  Server: NodeServer,
};

export type WithServices<T> = T & {
  ArchitectServices: typeof ArchitectServices;
  architect : typeof ArchitectServices;
};

export function InjectServices(
  target: { [name: string]: any } & {},
): WithServices<typeof target> {
  target.ArchitectServices = ArchitectServices;
  target.architect = ArchitectServices;
  target.Buffer = Buffer;
  architect.Server.start();

  return target as WithServices<typeof target>;
}
