import React, { createContext, useContext, useState } from 'react';
import './Tabs.css';

// Context for the Tabs component
const TabsContext = createContext(null);

/**
 * Tabs component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.defaultValue] - Default active tab value
 * @param {Function} [props.onValueChange] - Callback when tab changes
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Tabs content
 * @returns {JSX.Element} - Tabs component
 */
const Tabs = ({
  defaultValue,
  onValueChange,
  className = '',
  children,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);
  
  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  const tabsClasses = ['ui-tabs', className].filter(Boolean).join(' ');
  
  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={tabsClasses} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * TabsList component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Tab triggers
 * @returns {JSX.Element} - TabsList component
 */
const TabsList = ({ className = '', children, ...props }) => {
  const listClasses = ['ui-tabs-list', className].filter(Boolean).join(' ');
  
  return (
    <div className={listClasses} role="tablist" {...props}>
      {children}
    </div>
  );
};

/**
 * TabsTrigger component
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Value of the tab
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Trigger content
 * @returns {JSX.Element} - TabsTrigger component
 */
const TabsTrigger = ({ value, className = '', children, ...props }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;
  
  const triggerClasses = [
    'ui-tabs-trigger',
    isActive ? 'ui-tabs-trigger-active' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={triggerClasses}
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * TabsContent component
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Value of the tab
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {React.ReactNode} props.children - Content
 * @returns {JSX.Element | null} - TabsContent component
 */
const TabsContent = ({ value, className = '', children, ...props }) => {
  const { value: selectedValue } = useContext(TabsContext);
  const isActive = selectedValue === value;
  
  if (!isActive) {
    return null;
  }
  
  const contentClasses = [
    'ui-tabs-content',
    isActive ? 'ui-tabs-content-active' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={contentClasses}
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 