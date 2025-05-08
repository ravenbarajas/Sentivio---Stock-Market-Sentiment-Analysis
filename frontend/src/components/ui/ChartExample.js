import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button, 
  Select,
  SelectOption,
  Badge
} from './index';
import Chart from './Chart';
import StatisticsCard from './StatisticsCard';
import './ChartExample.css';

/**
 * ChartExample component that demonstrates various chart types and options
 */
const ChartExample = () => {
  const [chartType, setChartType] = useState('line');

  // Sample data for line/bar charts
  const timeSeriesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 80],
        borderColor: 'var(--chart-primary)',
        backgroundColor: 'var(--chart-primary-transparent)',
        tension: 0.3,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90, 85, 72, 60, 40, 35],
        borderColor: 'var(--chart-secondary)',
        backgroundColor: 'var(--chart-secondary-transparent)',
        tension: 0.3,
      },
    ],
  };

  // Sample data for pie/doughnut charts
  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      {
        label: 'Dataset',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'var(--chart-primary-transparent)',
          'var(--chart-secondary-transparent)',
          'var(--chart-tertiary-transparent)',
          'var(--chart-quaternary-transparent)',
          'var(--chart-color-1-transparent)',
        ],
        borderColor: [
          'var(--chart-primary)',
          'var(--chart-secondary)',
          'var(--chart-tertiary)',
          'var(--chart-quaternary)',
          'var(--chart-color-1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for radar chart
  const radarData = {
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Design'],
    datasets: [
      {
        label: 'Product A',
        data: [65, 59, 90, 81, 56, 55],
        borderColor: 'var(--chart-primary)',
        backgroundColor: 'var(--chart-primary-transparent)',
      },
      {
        label: 'Product B',
        data: [28, 80, 40, 19, 96, 27],
        borderColor: 'var(--chart-secondary)',
        backgroundColor: 'var(--chart-secondary-transparent)',
      },
    ],
  };

  // Sample data for mini-charts in statistics cards
  const generateMiniChartData = (values) => ({
    labels: Array(values.length).fill(''),
    datasets: [
      {
        data: values,
        borderColor: 'var(--chart-primary)',
        backgroundColor: 'var(--chart-primary-transparent)',
        fill: true,
        tension: 0.5,
        borderWidth: 2,
      },
    ],
  });

  const statisticsData = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      unit: '$',
      change: 20.1,
      timeframe: 'from last month',
      chartData: generateMiniChartData([10, 15, 5, 20, 25, 18, 30, 35]),
    },
    {
      title: 'Subscriptions',
      value: '2,350',
      change: -5.25,
      timeframe: 'from last month',
      chartData: generateMiniChartData([30, 25, 35, 20, 15, 10, 5, 10]),
    },
    {
      title: 'Active Users',
      value: '14,532',
      change: 12.2,
      timeframe: 'from last month',
      chartData: generateMiniChartData([10, 20, 15, 25, 22, 30, 28, 35]),
    },
    {
      title: 'Conversion Rate',
      value: '3.24',
      unit: '%',
      change: 2.3,
      timeframe: 'from last month',
      chartData: generateMiniChartData([2, 3, 2.5, 3.5, 2.8, 3.2, 3.5, 3.8]),
    },
  ];

  return (
    <div className="ui-chart-example">
      <h1 className="ui-chart-example-title">Chart Components</h1>
      
      {/* Statistics Cards */}
      <section className="ui-chart-section">
        <h2 className="ui-chart-section-title">Statistics with Mini Charts</h2>
        <div className="ui-statistics-grid">
          {statisticsData.map((stat, index) => (
            <StatisticsCard
              key={index}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              change={stat.change}
              timeframe={stat.timeframe}
              chartData={stat.chartData}
            />
          ))}
        </div>
      </section>
      
      {/* Chart Types Showcase */}
      <section className="ui-chart-section">
        <h2 className="ui-chart-section-title">Chart Types</h2>
        <Tabs defaultValue="time-series">
          <TabsList>
            <TabsTrigger value="time-series">Time Series</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          {/* Time Series Charts */}
          <TabsContent value="time-series">
            <Card>
              <CardHeader>
                <CardTitle>Time Series Charts</CardTitle>
                <CardDescription>Visualize data trends over time with line and bar charts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="ui-chart-type-selector">
                  <Badge>{chartType === 'line' ? 'Line Chart' : 'Bar Chart'}</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                  >
                    Toggle Chart Type
                  </Button>
                </div>
                <Chart type={chartType} data={timeSeriesData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Distribution Charts */}
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Charts</CardTitle>
                <CardDescription>Visualize data distribution with pie and doughnut charts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="ui-chart-grid">
                  <div className="ui-chart-grid-item">
                    <h3 className="ui-chart-title">Pie Chart</h3>
                    <Chart type="pie" data={pieData} />
                  </div>
                  <div className="ui-chart-grid-item">
                    <h3 className="ui-chart-title">Doughnut Chart</h3>
                    <Chart type="doughnut" data={pieData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comparison Charts */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Comparison Charts</CardTitle>
                <CardDescription>Compare multiple dimensions of data with radar charts</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="radar" data={radarData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default ChartExample; 