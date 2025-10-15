import React from 'react';
import ReactDOM from 'react-dom';

import { Chart, Title } from '@highcharts/react';
import { Accessibility } from '@highcharts/react/options/Accessibility';
import { BubbleSeries } from '@highcharts/react/series/Bubble';

export default function ChartComponent() {
    const series1 = [
      [9, 81, 63],
      [98, 5, 89],
      [51, 50, 73],
      [41, 22, 14],
      [58, 24, 20],
      [78, 37, 34],
      [55, 56, 53],
      [18, 45, 70],
      [42, 44, 28],
      [3, 52, 59],
      [31, 18, 97],
      [79, 91, 63],
      [93, 23, 23],
      [44, 83, 22]
    ];
  
    const series2 = [
      [42, 38, 20],
      [6, 18, 1],
      [1, 93, 55],
      [57, 2, 90],
      [80, 76, 22],
      [11, 74, 96],
      [88, 56, 10],
      [30, 47, 49],
      [57, 62, 98],
      [4, 16, 16],
      [46, 10, 11],
      [22, 87, 89],
      [57, 91, 82],
      [45, 15, 98]
    ];
    
    return (
        <div>
          <Chart>
            <Title>Simple Bubble Chart</Title>
            <Accessibility />
            <BubbleSeries data={series1} />
            <BubbleSeries data={series2} />
          </Chart>
        </div>
      );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);