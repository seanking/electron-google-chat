const {app, ipcMain} = require('electron');
const contextMenu = require('electron-context-menu');

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
