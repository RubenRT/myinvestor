import { useNotificationStore } from '@/stores/notification.store';
import styles from './Toast.module.css';

export function ToastContainer() {
  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.toast} ${styles[notification.type]}`}
          role="alert"
        >
          <span className={styles.message}>{notification.message}</span>
          <button
            className={styles.dismiss}
            onClick={() => removeNotification(notification.id)}
            aria-label="Cerrar notificacion"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
