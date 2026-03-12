import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';
type ButtonSize = 'small' | 'default';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'default',
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === 'small' ? styles.small : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
