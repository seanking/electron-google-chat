const path = require('path');
const {shell, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');

const {isMacOS, isWindows} = require('./os-check');

/**
 * Creates a new BrowserWindow.
 *
 * @param {string} url The URL to load.
 * @return {BrowserWindow} The main browser window.
 */
exports.createWindow = function(url) {
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
      spellcheck: true,
      preload: path.join(__dirname, 'notification.js'),
    },
  });

  mainWindowState.manage(win);

  if (isWindows()) {
    new Badge(win, {});
  }

  win.loadURL(url);

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
