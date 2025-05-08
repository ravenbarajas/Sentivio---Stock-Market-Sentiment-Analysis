import React from 'react';
import './Badge.css';

/**
 * Badge component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Badge variant (default, secondary, outline, destructive)
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Badge component
 */
const Badge = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const badgeClasses = [
    'ui-badge',
    `ui-badge-${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge; 