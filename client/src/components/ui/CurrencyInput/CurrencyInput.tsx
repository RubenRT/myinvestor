import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './CurrencyInput.module.css';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  currency?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ label, error, currency = 'EUR', className, ...props }, ref) {
    const inputClass = [styles.input, error ? styles.hasError : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputContainer}>
          <input
            ref={ref}
            type="number"
            step="any"
            min="0"
            className={inputClass}
            {...props}
          />
          <span className={styles.suffix}>{currency}</span>
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);
