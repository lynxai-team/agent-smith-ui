import { requireConfirmation } from '@/components/vibe/confirm/composable.js';
import type { NotificationMsg } from '../interfaces.js';
import { addNotification } from '@/components/vibe/notification/composable.js';
import type { NotificationSeverity } from '@/components/vibe/notification/composable.js';

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

function confirm(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  onReject: () => Promise<void> = async () => { },
) {
  requireConfirmation({ title, message: body, accept: onAccept, reject: onReject });
}

const msg: NotificationMsg = {
  info,
  success,
  warn,
  error,
}

export { confirm, msg }
