import { WorkerAdapter } from 'maestro-electron';
import ArchitectServer from './server.boot';
import { isMainThread, parentPort } from 'worker_threads';

if(isMainThread) {
  throw new Error("Server Worker cannot be run on the main thread!");
}

const Server = ArchitectServer;

Server.addAdapter(
  new WorkerAdapter(parentPort)
);

Server.start();

console.log("Architect Server worker is running!");