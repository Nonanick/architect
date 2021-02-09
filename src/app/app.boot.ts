import "v8-compile-cache";
import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import { InterceptAbsoluteFileResolution } from "./scripts/intercept_file_protocol";
import { bootServer } from "./app.server.boot";

export const ArchitectPublicPath = path.resolve(
  __dirname,
  "..",
  "..",
  "public",
);

app.on("ready", () => {
  protocol.interceptFileProtocol("file", InterceptAbsoluteFileResolution);
  let url: string | undefined = undefined;

  if (process.argv.includes("--url")) {
    let ioURL = process.argv.indexOf("--url") + 1;
    url = process.argv[ioURL];
  }

  // Will run the server
  bootServer();

  let window = new BrowserWindow({
    width: 800,
    height: 400,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(ArchitectPublicPath, "img", "favicon.png"),

    webPreferences: {
      nodeIntegration: false,
      allowRunningInsecureContent: false,
      contextIsolation: false,
      enableWebSQL: true,
      webSecurity: true,
      preload: path.resolve(__dirname, "scripts", "preload_page.js"),
    },
  });

  process.stdin.on("data", (msg) => {
    if (String(msg) === "SIGKILL") {
      process.stdout.write(
        "url: " +
            String(window.webContents.getURL()).split("#")[1] ?? "",
      );
      app.exit(0);
    }
  });

  window.loadFile(path.resolve(ArchitectPublicPath, "index.html"), {
    hash: url ?? "",
  });

  ipcMain.on("pick-folder", (ev) => {
    dialog.showOpenDialog(window, {
      properties: ["openDirectory"],
      title: "Architect - Choose Folder",
    }).then((location) => {
      ev.reply("pick-folder-response", true, location);
    }).catch((err) => {
      ev.reply("pick-folder-response", false, err);
    });
  });

  window.maximize();
  window.show();

  window.on("ready-to-show", () => {
    if (url != undefined) {
    }
    console.log("Window is ready to show");
  });
});

app.on("window-all-closed", () => {
  app.exit(0);
});

process.on("SIGINT", () => {
  app.exit(0);
  process.exit();
});

process.on("beforeExit", () => {
  app.exit(0);
});
