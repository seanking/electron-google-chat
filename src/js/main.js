const {app, ipcMain, shell, BrowserWindow} = require('electron');
const contextMenu = require('electron-context-menu');

const windowFactory = require('./window.js');
const {isMacOS} = require('./os-check');

app.whenReady().then(() => {
  windowFactory.createWindow('https://chat.google.com');
});

app.on('window-all-closed', (event) => {
  if (!isMacOS()) {
    app.quit();
  }
});

app.on('activate', () => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.show();
  });
});

app.on('browser-window-focus', (event, window) => {
  if (window.webContents) {
    window.webContents.send('clear-notifications');
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', function(event, url) {
    event.preventDefault();
    if (!url.includes('about:blank')) {
      shell.openExternal(url);
    }
  });
});

app.on('before-quit', () => {
  if (isMacOS()) {
    app.exit();
  }
});

/**
 * Identify if the any browser windows have focus.
 *
 * @return {boolean} True if a browser windows has focus.
 */
function isWindowsFocused() {
  return BrowserWindow.getAllWindows().reduce((accumulator, currentValue) => {
    return accumulator || currentValue.isFocused();
  }, false);
}

ipcMain.on('update-badge', function(event, count) {
  const badgeCount = count === null ? 0 : count;

  if (!isWindowsFocused() || badgeCount === 0) {
    app.setBadgeCount(badgeCount);
  }
});

ipcMain.on('focus', function(event, count) {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.moveTop();
    window.focus();
  });
});

contextMenu({
  prepend: (defaultActions, parameters, browserWindow) => [
    {
      label: 'Rainbow',
      visible: parameters.mediaType === 'image',
    },
    {
      label: 'Search Google for “{selection}”',
      visible: parameters.selectionText.trim().length > 0,
      click: () => {
        shell.openExternal(`https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`);
      },
    },
  ],
});
