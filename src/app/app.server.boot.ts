import { ipcMain } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import { ElectronIPCAdapter } from "maestro-electron";
import ArchitectServer from "../server/server.boot";
import chokidar from "chokidar";
import {
  IPCAdapterNewRequestEvent,
  IPCAdapterNewResponseEvent,
} from "maestro-electron/dist/adapter/ElectronIPCAdapter";
import type { IPCResponse } from "maestro-electron/dist/response/IPCResponse";
import type { IpcMainEvent } from 'electron/main';
import type { IPCRequest } from 'maestro-electron/dist/request/IPCRequest';

export function bootServer() {
  // If in dev mode we will re-run a new Thread everytime
  if (process.argv.includes("--dev")) {
    let restartWorkerBroker : NodeJS.Timeout;

    let currentWorker = new Worker(
      path.resolve(
        __dirname,
        "..",
        "server",
        "server.worker.js",
      ),
    );

    attachWorkerToIPC(currentWorker);

    for (let dir of ["server", "lib"]) {
      chokidar.watch(
        path.join(__dirname, "..", dir),
        {
          ignoreInitial: true,
        },
      ).on("all", (evName, file) => {
        if (restartWorkerBroker == null && file.match(/\.js$/)) {
          restartWorkerBroker = setTimeout(() => {
            console.log(`[AppServerController]: JS file change detected!\n'${file}'\n-> Restaring server worker!`);
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
                console.log(`[AppServerController] Removing all request listeners from main!\n`, workerRequestListeners);
                workerRequestListeners.forEach((requestListener) => {
                  ipcMain.off(IPCAdapterNewRequestEvent, requestListener);
                });
                workerRequestListeners = [];

                attachWorkerToIPC(currentWorker);

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

let workerRequestListeners : any[] = [];

function attachWorkerToIPC(worker: Worker) {

  //ipcMain.removeAllListeners();

  let listener =  (ev : IpcMainEvent, req : IPCRequest) => {
    let reqId = req._id;

    let workerResponseListener = (response : IPCResponse) => {
      if(response._id === reqId) {
        console.log("[AppWorker] Received response for request" + reqId);
        ev.reply(IPCAdapterNewResponseEvent, response);
        worker.off("message", workerResponseListener);
      }
    };
    
    worker.on("message", workerResponseListener);
    worker.postMessage(req);
  };

  workerRequestListeners.push(listener);

  ipcMain.on(IPCAdapterNewRequestEvent, listener);

}
