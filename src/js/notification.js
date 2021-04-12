const ipc = require('electron').ipcRenderer;

let notificationCount = 0;
ipc.on('clear-notifications', (event, arg) => {
  notificationCount = 0;
  ipc.send('update-badge', null);
});

/**
 * Override the behavior of the Notification Class.
 */
class NotificationOverride extends Notification {
  /**
  * Construct a Notifcation and send a message to update the badge.
  *
  * @param {String} title The title of the notification.
  * @param {Object} options The options for the notification.
  */
  constructor(title, options) {
    super(title, options);
    ipc.send('update-badge', ++notificationCount);

    this.onclick = (event) => {
      ipc.send('focus');
    };
  }
}

window.Notification = NotificationOverride;
