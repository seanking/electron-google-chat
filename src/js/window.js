const path = require('path');
const {BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
const Badge = require('electron-windows-badge');

const {isMacOS, isWindows} = require('./os-check');
const {userAgent} = require('./user-agent');

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

  win.loadURL(url, {userAgent: userAgent()});

  win.on('close', function(event) {
    if (isMacOS()) {
      event.preventDefault();
      win.hide();
    }
  });

  return win;
};
