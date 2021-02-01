//import 'v8-compile-cache';
import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import path from 'path';
import { InterceptAbsoluteFileResolution } from './scripts/intercept_file_protocol';
import ArchitectServer from '../server/server.boot';
import { ElectronIPCAdapter } from 'maestro-electron';

export const ArchitectPublicPath = path.resolve(__dirname, '..', '..', 'public');

app.on('ready', () => {

  protocol.interceptFileProtocol('file', InterceptAbsoluteFileResolution);

  let window = new BrowserWindow({
    width: 800,
    height: 400,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      allowRunningInsecureContent: false,
      contextIsolation: false,
      enableWebSQL: true,
      preload: path.resolve(__dirname, 'scripts', 'preload_page.js')
    }
  });

  window.loadFile(
    path.join(ArchitectPublicPath, 'index.html')
  );

  bootServer();
  window.maximize();
  window.show();

  window.on('ready-to-show', () => {
    console.log('Window is ready to show');
  });

});

app.on('window-all-closed', () => {
  app.exit(0);
});

async function bootServer(): Promise<void> {
  let adapter = new ElectronIPCAdapter(ipcMain);
  ArchitectServer.addAdapter(
    adapter
  );

  ArchitectServer.start();
}

