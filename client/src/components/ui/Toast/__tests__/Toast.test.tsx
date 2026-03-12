import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { ToastContainer } from '../Toast';
import { useNotificationStore } from '@/stores/notification.store';

describe('ToastContainer', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it('renders nothing when there are no notifications', () => {
    const { container } = renderWithProviders(<ToastContainer />);
    expect(container.innerHTML).toBe('');
  });

  it('renders notification messages', () => {
    useNotificationStore.setState({
      notifications: [
        { id: '1', type: 'success', message: 'Done!' },
        { id: '2', type: 'error', message: 'Failed!' },
      ],
    });

    renderWithProviders(<ToastContainer />);

    expect(screen.getByText('Done!')).toBeInTheDocument();
    expect(screen.getByText('Failed!')).toBeInTheDocument();
  });

  it('renders with role=alert for accessibility', () => {
    useNotificationStore.setState({
      notifications: [{ id: '1', type: 'success', message: 'OK' }],
    });

    renderWithProviders(<ToastContainer />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has aria-live polite container', () => {
    useNotificationStore.setState({
      notifications: [{ id: '1', type: 'success', message: 'OK' }],
    });

    renderWithProviders(<ToastContainer />);
    expect(screen.getByText('OK').closest('[aria-live]')).toHaveAttribute('aria-live', 'polite');
  });

  it('dismiss button removes notification from store', async () => {
    const user = userEvent.setup();
    useNotificationStore.setState({
      notifications: [{ id: '1', type: 'success', message: 'Bye' }],
    });

    renderWithProviders(<ToastContainer />);
    await user.click(screen.getByRole('button', { name: 'Cerrar notificacion' }));

    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });
});
