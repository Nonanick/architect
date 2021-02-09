import { ipcMain, WebContents } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import { ElectronIPCAdapter, WorkerIPCClient } from "maestro-electron";
import ArchitectServer from "../server/server.boot";
import chokidar from "chokidar";
import {
  IPCAdapterNewRequestEvent,
  IPCAdapterNewResponseEvent,
} from "maestro-electron/dist/adapter/ElectronIPCAdapter";
import type { IPCResponse } from 'maestro-electron/dist/response/IPCResponse';

export function bootServer() {
  // If in dev mode we will re-run a new Thread everytime
  if (process.argv.includes("--dev")) {

    let restartWorkerBroker;

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
        if (restartWorkerBroker == null) {

          restartWorkerBroker = setTimeout(() => {
            console.log("File change detected! Restaring server worker!");
            WorkerMap.delete(currentWorker);
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
const WorkerMap : Map<Worker, WebContents> = new Map();

function attachWorkerToIPC(worker: Worker) {

  process.on("beforeExit",() => {
    try { 
      worker.terminate();
    } catch(err) {
      console.error("Failed to terminate worker", err);
    }
  });
  
  console.log("Removing all listeners from IPC");
  ipcMain.removeAllListeners();

  ipcMain.on(IPCAdapterNewRequestEvent, (ev, req) => {
    if(!WorkerMap.has(worker)) {
      WorkerMap.set(worker,ev.sender);
    }
    worker.postMessage(req);
  });

  worker.on("message", (response) => {
    sendResponseToTarget(worker, response);
  });
}

function sendResponseToTarget(worker : Worker, response : IPCResponse, count=0) {
  if(WorkerMap.has(worker)) { 
  let target = WorkerMap.get(worker);
  target.send(IPCAdapterNewResponseEvent, response);
  } else {
    if(count > 10) {
      console.error("Failed to deliver response to worker!", response);
    }
    setTimeout(() => {
      sendResponseToTarget(worker, response)
    }, 200);
  }
}