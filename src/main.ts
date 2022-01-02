import {BrowserWindow, app} from 'electron';
import path from "path";

const isDev = process.env.NODE_ENV === 'development';

/// #if DEBUG
if (isDev) {
  const execPath = process.platform === 'win32' ? '../node_modules/electron/dist/electron.exe' : '../node_modules/.bin/electron';

  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, execPath),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })
}
/// #endif

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({mode: 'detach'});
  }

  // noinspection JSIgnoredPromiseFromCall
  mainWindow.loadFile('dist/renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
