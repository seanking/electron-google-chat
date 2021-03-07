const ipc = require('electron').ipcRenderer;

class NotificationOverride extends Notification {
    constructor (title, options) {
        super(title, options);
        ipc.send("notification-show", {title: title, options: options});
    }
}

window.Notification = NotificationOverride;
