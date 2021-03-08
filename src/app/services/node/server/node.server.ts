import { ipcRenderer } from "electron";
import { IPCClient } from "maestro-electron";
import type { Server } from "../../interfaces/server/server.service";

let client = new IPCClient(ipcRenderer);
client.setDefaultTimeout(0);
export const NodeServer: Server = client;
