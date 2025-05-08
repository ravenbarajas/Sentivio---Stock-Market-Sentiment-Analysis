import React, { forwardRef } from 'react';
import './Select.css';

/**
 * Select component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.placeholder='Select an option'] - Select placeholder
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Select options
 * @returns {JSX.Element} - Select component
 */
const Select = forwardRef(({
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  children,
  ...props
}, ref) => {
  const selectClasses = [
    'ui-select',
    disabled ? 'ui-select-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <select 
      className={selectClasses} 
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
});

/**
 * SelectOption component
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Option value
 * @param {boolean} [props.disabled=false] - Whether the option is disabled
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Option content
 * @returns {JSX.Element} - Option component
 */
const SelectOption = ({ 
  value, 
  disabled = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const optionClasses = [
    'ui-select-option',
    disabled ? 'ui-select-option-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <option
      value={value}
      disabled={disabled}
      className={optionClasses}
      {...props}
    >
      {children}
    </option>
  );
};

/**
 * SelectGroup component
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Group label
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Group options
 * @returns {JSX.Element} - Option group component
 */
const SelectGroup = ({ 
  label, 
  className = '', 
  children, 
  ...props 
}) => {
  const groupClasses = [
    'ui-select-group',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <optgroup
      label={label}
      className={groupClasses}
      {...props}
    >
      {children}
    </optgroup>
  );
};

Select.displayName = 'Select';

export { Select, SelectOption, SelectGroup }; 