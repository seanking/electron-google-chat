const path = require('path');
const {app, shell, BrowserWindow, ipcMain} = require('electron');
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
 * Identify if the OS is macOS.
 *
 * @return {boolean} True if the OS is macOS.
 */
function isMacOS() {
  return process.platform === 'darwin';
}

/**
 * Creates a new BrowserWindow.
 *
 * @return {BrowserWindow} The main browser window.
 */
function createWindow() {
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
}

let window = null;

app.whenReady().then(() => {
  window = createWindow();
  window.webContents.openDevTools();
});


app.on('window-all-closed', (event) => {
  if (isMacOS()) {
    app.quit();
  }
});

app.on('activate', () => {
  window.show();
});

app.on('browser-window-focus', () => {
  window.webContents.send('clear-notifications');
});

app.on('before-quit', () => {
  if (isMacOS()) {
    app.exit();
  }
});

ipcMain.on('update-badge', function(event, count) {
  const badgeCount = count === null ? 0 : count;
  app.setBadgeCount(badgeCount);
});
