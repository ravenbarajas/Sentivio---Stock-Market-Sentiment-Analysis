import React from 'react';
import { ThemeToggle } from './ThemeProvider';
import './Header.css';

/**
 * Header component with theme toggle
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title='Stock Market Analytics'] - Header title
 * @param {React.ReactNode} [props.rightContent] - Optional content for the right side
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Header component
 */
const Header = ({
  title = 'Stock Market Analytics',
  rightContent,
  className = '',
  ...props
}) => {
  const headerClasses = ['ui-header', className].filter(Boolean).join(' ');
  
  return (
    <header className={headerClasses} {...props}>
      <div className="ui-header-container">
        <div className="ui-header-left">
          <h1 className="ui-header-title">{title}</h1>
        </div>
        
        <div className="ui-header-right">
          {rightContent}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 