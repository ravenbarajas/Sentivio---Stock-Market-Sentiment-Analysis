import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PieController,
  DoughnutController,
  LineController,
  BarController,
  PolarAreaController,
  RadarController,
  ScatterController,
  BubbleController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2';
import './Chart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PieController,
  DoughnutController,
  LineController,
  BarController,
  PolarAreaController,
  RadarController,
  ScatterController,
  BubbleController,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Chart component with Shadcn UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='line'] - Chart type (line, bar, pie, doughnut, polarArea, radar, scatter, bubble)
 * @param {Object} props.data - Chart data object
 * @param {Object} [props.options={}] - Chart options
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} - Chart component
 */
const Chart = ({
  type = 'line',
  data,
  options = {},
  className = '',
  ...props
}) => {
  const chartClasses = ['ui-chart', `ui-chart-${type}`, className].filter(Boolean).join(' ');
  
  // Default options merged with user options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'var(--popover)',
        titleColor: 'var(--popover-foreground)',
        bodyColor: 'var(--popover-foreground)',
        borderColor: 'var(--border)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        bodyFont: {
          family: 'var(--font-sans)',
          size: 13
        },
        titleFont: {
          family: 'var(--font-sans)',
          size: 14,
          weight: 'bold'
        }
      }
    },
    ...options
  };

  // Render different chart types based on the type prop
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={defaultOptions} {...props} />;
      case 'pie':
        return <Pie data={data} options={defaultOptions} {...props} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} {...props} />;
      case 'polarArea':
        return <PolarArea data={data} options={defaultOptions} {...props} />;
      case 'radar':
        return <Radar data={data} options={defaultOptions} {...props} />;
      case 'scatter':
        return <Scatter data={data} options={defaultOptions} {...props} />;
      case 'bubble':
        return <Bubble data={data} options={defaultOptions} {...props} />;
      case 'line':
      default:
        return <Line data={data} options={defaultOptions} {...props} />;
    }
  };

  return (
    <div className={chartClasses}>
      {renderChart()}
    </div>
  );
};

export default Chart; 