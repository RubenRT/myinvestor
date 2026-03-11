import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { Modal } from '../Modal';

// jsdom doesn't implement HTMLDialogElement.showModal() / .close()
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

describe('Modal', () => {
  it('renders title and children when open', () => {
    renderWithProviders(
      <Modal open onClose={vi.fn()} title="My Modal">
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls showModal when open=true', () => {
    renderWithProviders(
      <Modal open onClose={vi.fn()} title="Test">
        Body
      </Modal>,
    );

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    renderWithProviders(
      <Modal open onClose={vi.fn()} title="Test" footer={<button>OK</button>}>
        Body
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    renderWithProviders(
      <Modal open onClose={vi.fn()} title="Test">
        Body
      </Modal>,
    );

    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <Modal open onClose={onClose} title="Test">
        Body
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
