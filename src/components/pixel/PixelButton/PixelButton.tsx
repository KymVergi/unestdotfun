import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './PixelButton.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
};

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  full?: boolean;
}

export interface PixelLinkProps extends CommonProps {
  href: string;
  external?: boolean;
}

export function PixelLink({
  children,
  href,
  external,
  variant = 'primary',
  size = 'md',
  className,
  full,
}: PixelLinkProps) {
  const cls = [
    styles.btn,
    variantClass[variant],
    sizeClass[size],
    full ? styles.full : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}

export interface PixelButtonProps
  extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {}

export function PixelButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  full,
  ...rest
}: PixelButtonProps) {
  return (
    <button
      {...rest}
      className={[
        styles.btn,
        variantClass[variant],
        sizeClass[size],
        full ? styles.full : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}

export default PixelButton;
