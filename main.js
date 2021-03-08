const windowFactory = require('./window.js');
const {app, ipcMain} = require('electron');

let window = null;

/**
 * Identify if the OS is macOS.
 *
 * @return {boolean} True if the OS is macOS.
 */
function isMacOS() {
  return process.platform === 'darwin';
}

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
