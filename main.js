const path = require('path')
const { app, shell, BrowserWindow, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state');

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "renderer.js")
    }
  })

  mainWindowState.manage(win);
  
  win.loadURL('https://chat.google.com')

  win.on('close', function(event){
    if (process.platform === 'darwin') {
      event.preventDefault();
      win.hide();
    }
  })

  win.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  return win;
}

function isWindowFocused() {
  return BrowserWindow.getAllWindows().reduce((accumulator, current) => {
    accumulator = accumulator.isFocused || current.isFocused
  }, false);
}

let window = null;

app.whenReady().then(() => {
  window = createWindow()
});

app.on('window-all-closed', (event) => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  window.show();
});

app.on('browser-window-focus', () => {
  window.webContents.send("clear-notifications");
});

app.on('before-quit', () => {
  if (process.platform === 'darwin') {
    app.exit();
  }
});

ipcMain.on('update-badge', function (event, count) {
  if (!isWindowFocused()) {
    const badgeCount = count === null ? 0 : count;
    app.setBadgeCount(badgeCount);
  }
});