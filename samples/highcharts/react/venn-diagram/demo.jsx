import React from 'react';
import ReactDOM from 'react-dom';

import { Chart, Title, setHighcharts } from '@highcharts/react';
import { Accessibility } from '@highcharts/react/options/Accessibility';
import { VennSeries } from '@highcharts/react/series/Venn';

// Note: These imports are not necessary when using a build tool such as Vite
import 'highcharts/esm/modules/venn.src.js'
import HC from 'highcharts/esm/modules/accessibility.src.js'
setHighcharts(HC)

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
              <Title text="Simple Venn Diagram" />
              <Accessibility />
              <VennSeries options={{ name: 'Products' }} data={vennData} />
          </Chart>
      </div>
  );
}

ReactDOM.createRoot(
  document.querySelector('#container')
)?.render(<ChartComponent />);