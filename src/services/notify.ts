import { useConfirm } from "primevue/useconfirm";
import { ConfirmationOptions } from 'primevue/confirmationoptions';
import type { NotificationMsg } from '../interfaces.js';
import { addNotification } from '@/components/vibe/notification/composable.js';
import type { NotificationSeverity } from '@/components/vibe/notification/composable.js';

let confirm: {
  require: (option: ConfirmationOptions) => void;
  close: () => void;
}

function initNotifyService() {
  confirm = useConfirm();
}

function _msg(severity: NotificationSeverity, title: string, body: string, lifeTime = 3000): void {
  addNotification({ severity, title, detail: body, life: lifeTime });
}

function info(title: string, body: string, lifeTime = 3000): void {
  _msg('info', title, body, lifeTime);
};

function success(title: string, body: string, lifeTime = 3000): void {
  _msg('success', title, body, lifeTime);
};

function warn(title: string, body: string, lifeTime = 5000): void {
  _msg('warn', title, body, lifeTime);
};

function error(title: string, body: string, lifeTime = 8000): void {
  _msg('error', title, body, lifeTime);
};

function _confirmation(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  icon: string = "",
  onReject: () => Promise<void>,
  type: "success" | "danger",
) {
  confirm.require({
    message: body,
    header: title,
    icon: icon,
    acceptClass: `${type}btn`,
    accept: onAccept,
    reject: onReject,
  });
}

function confirmSuccess(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  icon: string = "",
  onReject: () => Promise<void> = async () => { }
) {
  _confirmation(title, body, onAccept, icon, onReject, "success")
}

function confirmDanger(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  icon: string = "",
  onReject: () => Promise<void> = async () => { }
) {
  _confirmation(title, body, onAccept, icon, onReject, "danger")
}

const msg: NotificationMsg = {
  info,
  success,
  warn,
  error,
}

export { initNotifyService, confirmSuccess, confirmDanger, msg }
