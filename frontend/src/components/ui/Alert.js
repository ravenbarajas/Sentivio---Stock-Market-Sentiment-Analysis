import React from 'react';
import './Alert.css';

/**
 * Alert component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Alert variant (default, destructive)
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Alert component
 */
const Alert = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const alertClasses = [
    'ui-alert',
    `ui-alert-${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div role="alert" className={alertClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * AlertTitle component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Alert title content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Alert title component
 */
const AlertTitle = ({
  children,
  className = '',
  ...props
}) => {
  const titleClasses = [
    'ui-alert-title',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <h5 className={titleClasses} {...props}>
      {children}
    </h5>
  );
};

/**
 * AlertDescription component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Alert description content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Alert description component
 */
const AlertDescription = ({
  children,
  className = '',
  ...props
}) => {
  const descriptionClasses = [
    'ui-alert-description',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={descriptionClasses} {...props}>
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription }; 