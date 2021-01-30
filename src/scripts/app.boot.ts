import { app, BrowserWindow, ipcMain } from 'electron';

app.on('ready', () => {


});

app.on('window-all-closed', () => {
  app.exit(0);
});