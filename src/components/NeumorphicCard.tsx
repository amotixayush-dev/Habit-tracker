import React from 'react';
import clsx from 'clsx';

interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'pressed' | 'convex' | 'concave';
  elevation?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  variant = 'flat',
  elevation = 'md',
  className = '',
  children,
  ...props
}) => {
  const getElevation = () => {
    if (variant === 'pressed') {
      return elevation === 'sm' ? 'neu-pressed-sm' : 'neu-pressed';
    }
    if (variant === 'convex') return 'neu-convex';
    if (variant === 'concave') return 'neu-concave';
    
    switch (elevation) {
      case 'sm':
        return 'neu-flat-sm';
      case 'lg':
        return 'neu-flat-lg';
      default:
        return 'neu-flat';
    }
  };

  return (
    <div
      className={clsx(
        'rounded-neu transition-all duration-200',
        getElevation(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
