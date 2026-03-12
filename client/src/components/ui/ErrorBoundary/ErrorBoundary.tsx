import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h2 className={styles.title}>Algo ha salido mal</h2>
          <p className={styles.message}>
            Ha ocurrido un error inesperado. Puedes intentar recargar la pagina.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recargar pagina
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
