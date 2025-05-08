import React from 'react';
import './Button.css';

/**
 * Button component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Button variant (default, outline, ghost, link, destructive)
 * @param {string} [props.size='default'] - Button size (default, sm, lg, icon)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type attribute
 * @returns {JSX.Element} - Button component
 */
const Button = ({
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClass = 'ui-button';
  const variantClass = `ui-button-${variant}`;
  const sizeClass = `ui-button-${size}`;
  const disabledClass = disabled ? 'ui-button-disabled' : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 