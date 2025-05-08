import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Chart from './Chart';
import './StatisticsCard.css';

/**
 * StatisticsCard component with integrated chart
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} [props.description] - Optional card description
 * @param {string|number} props.value - Main statistic value
 * @param {string} [props.unit=''] - Unit for the value (e.g., '$', '%')
 * @param {number} [props.change] - Change value (can be positive or negative)
 * @param {string} [props.timeframe=''] - Timeframe description (e.g., 'vs last month')
 * @param {Object} [props.chartData] - Data for the small chart
 * @param {string} [props.chartType='line'] - Type of chart to display
 * @param {Object} [props.chartOptions={}] - Additional chart options
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - StatisticsCard component
 */
const StatisticsCard = ({
  title,
  description,
  value,
  unit = '',
  change,
  timeframe = '',
  chartData,
  chartType = 'line',
  chartOptions = {},
  className = '',
  ...props
}) => {
  // Determine if change is positive, negative or neutral
  const getChangeType = () => {
    if (!change) return 'neutral';
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  };
  
  const changeType = getChangeType();
  const hasChart = !!chartData;

  // Format change value as percentage if needed
  const formattedChange = Math.abs(change).toLocaleString(undefined, {
    minimumFractionDigits: change % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
  
  // Default chart options for the mini chart
  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      }
    },
    elements: {
      line: {
        tension: 0.5,
      },
      point: {
        radius: 0,
      }
    },
    ...chartOptions
  };
  
  const cardClasses = [
    'ui-statistics-card', 
    hasChart ? 'ui-statistics-card-with-chart' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Card className={cardClasses} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="ui-statistics-content">
          <div className="ui-statistics-value-container">
            <div className="ui-statistics-value">
              {unit && <span className="ui-statistics-unit">{unit}</span>}
              {value}
            </div>
            
            {change !== undefined && (
              <div className={`ui-statistics-change ui-statistics-change-${changeType}`}>
                <span className="ui-statistics-change-icon">
                  {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '−'}
                </span>
                <span className="ui-statistics-change-value">
                  {formattedChange}{changeType !== 'neutral' ? '%' : ''}
                </span>
                {timeframe && <span className="ui-statistics-timeframe">{timeframe}</span>}
              </div>
            )}
          </div>
          
          {hasChart && (
            <div className="ui-statistics-chart">
              <Chart 
                type={chartType}
                data={chartData}
                options={defaultChartOptions}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard; 