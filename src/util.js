export function notify (that, title, msg, call) {
  if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(function (status) {
      if (status === 'denied') {
        that.$notify({ title: title, message: msg, duration: 0 })
      } else {
        let notify = new Notification(title, {body: msg})
        notify.onclick = (call == null) ? function () { notify.close() } : call()
      }
    }).then(r => {})
  } else {
    that.$notify({ title: title, message: msg, duration: 0 })
  }
}
