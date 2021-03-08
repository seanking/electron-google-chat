const path = require('path');
const {shell, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');

/**
 * Identify if the OS is Windows.
 *
 * @return {boolean} True if the OS is Windows.
 */
function isWindows() {
  return process.platform === 'win32';
}

/**
 * Creates a new BrowserWindow.
 *
 * @return {BrowserWindow} The main browser window.
 */
exports.createWindow = function() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  });

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'renderer.js'),
    },
  });

  mainWindowState.manage(win);

  if (isWindows()) {
    new Badge(win, {});
  }

  win.loadURL('https://chat.google.com');

  win.on('close', function(event) {
    if (isMacOS()) {
      event.preventDefault();
      win.hide();
    }
  });

  win.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  return win;
};
