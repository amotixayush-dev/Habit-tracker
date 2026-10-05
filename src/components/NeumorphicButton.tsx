import React from 'react';
import clsx from 'clsx';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'accent' | 'danger' | 'pressed';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
  children: React.ReactNode;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  variant = 'default',
  size = 'md',
  active = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-medium',
    md: 'px-4 py-2.5 text-sm rounded-2xl font-semibold',
    lg: 'px-6 py-3.5 text-base rounded-2xl font-bold',
    icon: 'p-2.5 rounded-2xl',
  };

  const getVariantStyles = () => {
    if (active || variant === 'pressed') {
      return 'neu-pressed text-indigo-600 dark:text-indigo-400';
    }

    switch (variant) {
      case 'primary':
        return 'neu-button text-indigo-600 dark:text-indigo-400 font-bold';
      case 'accent':
        return 'neu-button text-emerald-600 dark:text-emerald-400 font-bold';
      case 'danger':
        return 'neu-button text-rose-600 dark:text-rose-400 font-bold';
      default:
        return 'neu-button text-neu-text dark:text-neu-darkText';
    }
  };

  return (
    <button
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center transition-all duration-150 outline-none',
        sizeClasses[size],
        getVariantStyles(),
        disabled && 'opacity-50 cursor-not-allowed transform-none shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
