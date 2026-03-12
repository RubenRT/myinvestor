import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { FundList } from '@/components/funds/FundList/FundList';
import { Portfolio } from '@/components/portfolio/Portfolio/Portfolio';
import { ToastContainer } from '@/components/ui/Toast/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary/ErrorBoundary';
import styles from './App.module.css';

export function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>MyInvestor</span>
        <nav className={styles.nav}>
          <NavLink to="/" className={linkClass} end>
            Fondos
          </NavLink>
          <NavLink to="/portfolio" className={linkClass}>
            Mi cartera
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<FundList />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <ToastContainer />
    </div>
  );
}
