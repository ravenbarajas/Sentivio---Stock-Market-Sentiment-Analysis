import React, { forwardRef } from 'react';
import './Input.css';

/**
 * Input component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder=''] - Input placeholder
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} [props.icon] - Optional icon to display inside the input
 * @param {React.ReactNode} [props.prefix] - Optional prefix content
 * @param {React.ReactNode} [props.suffix] - Optional suffix content
 * @returns {JSX.Element} - Input component
 */
const Input = forwardRef(({
  type = 'text',
  placeholder = '',
  disabled = false,
  className = '',
  icon,
  prefix,
  suffix,
  ...props
}, ref) => {
  const baseClass = 'ui-input-wrapper';
  const disabledClass = disabled ? 'ui-input-disabled' : '';
  const hasIconClass = icon ? 'ui-input-with-icon' : '';
  const hasPrefixClass = prefix ? 'ui-input-with-prefix' : '';
  const hasSuffixClass = suffix ? 'ui-input-with-suffix' : '';
  
  const wrapperClasses = [
    baseClass,
    disabledClass,
    hasIconClass,
    hasPrefixClass,
    hasSuffixClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      {icon && <div className="ui-input-icon">{icon}</div>}
      {prefix && <div className="ui-input-prefix">{prefix}</div>}
      <input
        type={type}
        className="ui-input"
        placeholder={placeholder}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      {suffix && <div className="ui-input-suffix">{suffix}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 