const ipc = require('electron').ipcRenderer;

console.log("testing renderer");

var Notification = function(title,ops) {
    ipc.send("notification-show", {title: title, options: ops});
};

Notification.requestPermission = () => {};
Notification.permission = "granted";
window.Notification = Notification;