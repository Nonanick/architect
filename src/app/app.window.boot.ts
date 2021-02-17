import { BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

export const ArchitectPublicPath = path.resolve(
  __dirname,
  "..",
  "..",
  "public",
);

export function bootWindow(): BrowserWindow {

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
      preload: path.resolve(__dirname, "scripts", "preload_page.esm.js"),
    },
  });

  window.loadFile(path.resolve(ArchitectPublicPath, "index.html"), {
  });

  ipcMain.on("pick-folder", (ev, id) => {
    dialog.showOpenDialog(window, {
      properties: ["openDirectory"],
      title: "Architect - Choose Folder",
    }).then((location) => {
      ev.reply("pick-folder-response", true, id, location);
    }).catch((err) => {
      ev.reply("pick-folder-response", false, id, err);
    });
  });

  ipcMain.on("clear-listeners", () => {
    ipcMain.removeAllListeners();
  });

  window.maximize();
  window.show();

  window.on("ready-to-show", () => {
    console.log("Window is ready to show");
  });

  return window;
}