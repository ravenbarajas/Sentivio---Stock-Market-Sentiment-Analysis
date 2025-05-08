import React from 'react';
import './Card.css';

/**
 * Card component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Card component
 */
const Card = ({ children, className = '', ...props }) => {
  const cardClasses = ['ui-card', className].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Header component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card header content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Card header component
 */
const CardHeader = ({ children, className = '', ...props }) => {
  const headerClasses = ['ui-card-header', className].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Title component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card title content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Card title component
 */
const CardTitle = ({ children, className = '', ...props }) => {
  const titleClasses = ['ui-card-title', className].filter(Boolean).join(' ');
  
  return (
    <h3 className={titleClasses} {...props}>
      {children}
    </h3>
  );
};

/**
 * Card Description component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card description content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Card description component
 */
const CardDescription = ({ children, className = '', ...props }) => {
  const descriptionClasses = ['ui-card-description', className].filter(Boolean).join(' ');
  
  return (
    <p className={descriptionClasses} {...props}>
      {children}
    </p>
  );
};

/**
 * Card Content component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Card content component
 */
const CardContent = ({ children, className = '', ...props }) => {
  const contentClasses = ['ui-card-content', className].filter(Boolean).join(' ');
  
  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Footer component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card footer content
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Card footer component
 */
const CardFooter = ({ children, className = '', ...props }) => {
  const footerClasses = ['ui-card-footer', className].filter(Boolean).join(' ');
  
  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 