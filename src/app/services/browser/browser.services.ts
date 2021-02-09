import type { Server } from "../interfaces/server/server.service";
import { BrowserServer } from "./server/browser.server";

export const BrowserServices: {
  Server: Server;
} = {
  Server: BrowserServer,
};
