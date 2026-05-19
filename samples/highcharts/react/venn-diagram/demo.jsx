import React from 'react';
import ReactDOM from 'react-dom';

import { Chart, Title } from '@highcharts/react';
import { Accessibility } from '@highcharts/react/options/Accessibility';
import { VennSeries } from '@highcharts/react/series/Venn';

export default function ChartComponent() {
  const vennData = [
      {
          sets: ['Product A'],
          value: 2,
          name: 'Product A'
      },
      {
          sets: ['Product B'],
          value: 2,
          name: 'Product B'
      },
      {
          sets: ['Product A', 'Product B'],
          value: 1,
          name: 'A ∩ B'
      }
  ];

  return (
      <div>
          <Chart>
              <Title>Simple Venn Diagram</Title>
              <Accessibility />
              <VennSeries options={{ name: 'Products' }} data={vennData} />
          </Chart>
      </div>
  );
}

ReactDOM.createRoot(
  document.querySelector('#container')
)?.render(<ChartComponent />);