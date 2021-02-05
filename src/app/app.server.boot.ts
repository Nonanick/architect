import {  ipcMain } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import { ElectronIPCAdapter , WorkerIPCClient} from "maestro-electron";
import ArchitectServer from "../server/server.boot";
import { ArchitectServices, SetServerService } from './services/inject_services';
import chokidar from "chokidar";

let currentWorker : Worker;

export function bootServer(){
  // If in dev mode we will re-run a new Thread everytime
  if (process.argv.includes("--dev")) {
    let restartWorkerBroker;

     currentWorker = new Worker(
      path.resolve(
        __dirname,
        "..",
        "server",
        "server.worker.js",
      ),
    );

    SetServerService(new WorkerIPCClient(currentWorker));

    for (let dir of ["server", "modules"]) {
      chokidar.watch(
        path.join(__dirname, "..", dir),
        {
          ignoreInitial: true,
        },
      ).on("all", (evName, file) => {
        if (restartWorkerBroker == null) {
          restartWorkerBroker = setTimeout(() => {
            console.log("File change detected! Restaring server worker!");
            currentWorker.terminate()
              .catch((err) => {
                console.error("Failed to kill old Server Worker Thread!", err);
              })
              .finally(() => {
                currentWorker = new Worker(
                  path.resolve(
                    __dirname,
                    "..",
                    "server",
                    "server.worker.js",
                  ),
                );

                (ArchitectServices().Server as WorkerIPCClient).setWorker(currentWorker);

                restartWorkerBroker = undefined;
              });
          }, 1000);
        }
      });
    }
  } else {
    let adapter = new ElectronIPCAdapter(ipcMain);
    ArchitectServer.addAdapter(
      adapter,
    );

    ArchitectServer.start();
  }
}

export function getCurrentWorker() {
  return currentWorker;
}