import "v8-compile-cache";
import { app, protocol } from "electron";
import { bootServer } from "./app.server.boot";
import { bootWindow } from './app.window.boot';
import { InterceptAbsoluteFileResolution } from "./scripts/intercept_file_protocol";


app.on("ready", () => {
  // Resolve "absolute paths" to targeted public folder
  protocol.interceptFileProtocol("file", InterceptAbsoluteFileResolution);

  // Run the "server" decoupled from the browser window
  bootServer();

  // Create and show the window
  bootWindow();
});

app.on("window-all-closed", () => {
  app.exit(0);
});

process.on("SIGINT", () => {
  app.exit(0);
  process.exit();
});

