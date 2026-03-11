import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNotificationStore } from '../notification.store';

describe('useNotificationStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useNotificationStore.setState({ notifications: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a notification with unique id and correct type/message', () => {
    useNotificationStore.getState().addNotification('success', 'Done');

    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].message).toBe('Done');
    expect(notifications[0].id).toBeTruthy();
  });

  it('supports error type', () => {
    useNotificationStore.getState().addNotification('error', 'Failed');

    const { notifications } = useNotificationStore.getState();
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].message).toBe('Failed');
  });

  it('auto-removes notification after 4000ms', () => {
    useNotificationStore.getState().addNotification('success', 'Temp');

    expect(useNotificationStore.getState().notifications).toHaveLength(1);

    vi.advanceTimersByTime(4000);

    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('does not remove notification before 4000ms', () => {
    useNotificationStore.getState().addNotification('success', 'Temp');

    vi.advanceTimersByTime(3999);

    expect(useNotificationStore.getState().notifications).toHaveLength(1);
  });

  it('manually removes notification and clears timer', () => {
    useNotificationStore.getState().addNotification('success', 'Manual');
    const id = useNotificationStore.getState().notifications[0].id;

    useNotificationStore.getState().removeNotification(id);

    expect(useNotificationStore.getState().notifications).toHaveLength(0);

    // Advancing past auto-dismiss should not cause errors
    vi.advanceTimersByTime(5000);
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('handles multiple simultaneous notifications independently', () => {
    const store = useNotificationStore.getState();
    store.addNotification('success', 'First');

    vi.advanceTimersByTime(2000);
    store.addNotification('error', 'Second');

    expect(useNotificationStore.getState().notifications).toHaveLength(2);

    // First one auto-removes at 4000ms
    vi.advanceTimersByTime(2000);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
    expect(useNotificationStore.getState().notifications[0].message).toBe('Second');

    // Second one auto-removes at 6000ms (2000 + 4000)
    vi.advanceTimersByTime(2000);
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('generates unique ids for each notification', () => {
    const store = useNotificationStore.getState();
    store.addNotification('success', 'A');
    store.addNotification('success', 'B');

    const ids = useNotificationStore.getState().notifications.map((n) => n.id);
    expect(ids[0]).not.toBe(ids[1]);
  });
});
