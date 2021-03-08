const {app, ipcMain} = require('electron');

const windowFactory = require('./window.js');
const {isMacOS} = require('./os-check');

let window = null;

app.whenReady().then(() => {
  window = windowFactory.createWindow('https://chat.google.com');
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
