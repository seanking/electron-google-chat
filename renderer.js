const ipc = require('electron').ipcRenderer;

let notificationCount = 0;

ipc.on('clear-notifications', (event, arg) => {
    notificationCount = 0;
    ipc.send("update-badge", null);
});

class NotificationOverride extends Notification {
    constructor (title, options) {
        super(title, options);
        ipc.send("update-badge", ++notificationCount);
    }
}

window.Notification = NotificationOverride;
