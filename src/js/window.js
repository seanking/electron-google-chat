const path = require('path');
const {BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
const Badge = require('electron-windows-badge');

const {isMacOS, isWindows} = require('./os-check');

/* eslint max-len: ["error", { "ignoreStrings": true }]*/
/**
 * Provides a Chrome user agent for the OS.
 *
 * @return {string} The user agent
 */
function userAgent() {
  if (isMacOS()) {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  } else if (isWindows()) {
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  } else {
    return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  }
}

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
