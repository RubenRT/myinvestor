import { type ReactNode } from 'react';
import { render, renderHook, type RenderOptions, type RenderHookOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
  initialEntries?: string[];
}

function createWrapper(initialEntries: string[] = ['/']) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = createTestQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] },
) {
  const { initialEntries, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: createWrapper(initialEntries),
    ...renderOptions,
  });
}

export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'> & { initialEntries?: string[] },
) {
  const { initialEntries, ...hookOptions } = options ?? {};
  return renderHook(hook, {
    wrapper: createWrapper(initialEntries),
    ...hookOptions,
  });
}

export { screen, within, waitFor, act, cleanup } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
