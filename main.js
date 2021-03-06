const path = require('path')
const { app, shell, BrowserWindow, ipcMain } = require('electron')


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "renderer.js")
    }
  })

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
}

function isWindowFocused() {
  return BrowserWindow.getAllWindows().reduce((accumulator, current) => {
    accumulator = accumulator.isFocused || current.isFocused
  }, false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', (event) => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    BrowserWindow.getAllWindows().forEach( (win) => {
      win.show();
    });
  }
});

app.on('browser-window-focus', () => {
  app.setBadgeCount(0);
});

app.on('before-quit', () => {
  if (process.platform === 'darwin') {
    app.exit();
  }
});

ipcMain.on('notification-show', function (event, arg) {
  if (!isWindowFocused()) {
    const count = app.getBadgeCount() + 1;
    app.setBadgeCount(count);
  }
});