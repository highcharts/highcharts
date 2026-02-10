# Data handling

## Store chart data

For organizing your data, you should follow React [principles](https://react.dev/learn/choosing-the-state-structure#principles-for-structuring-state) as a foundation.

You should store **dynamic data** that changes over time in state, and keep **static configuration** as constants or inline within your components:

```tsx
import React, { useState } from 'react';
import { Chart, Title, PlotOptions, Series } from '@highcharts/react';

const PLOT_OPTIONS_SERIES = {
  dataLabels: {
    enabled: true,
    format: '{y}'
  }
};

export default function MyChart() {
  const [series, setSeries] = useState({
    data: [1, 2, 3, 4, 5],
    options: {
      color: 'green'
    }
  });

  return (
    <Chart>
      <Title>My Chart</Title>
      <PlotOptions series={PLOT_OPTIONS_SERIES} />
      <Series data={series.data} options={series.options} />
    </Chart>
  );
}
```

> **Note:** What qualifies as **dynamic data** depends on your use case. Store configuration in state if it needs to change over time. Otherwise, use constants.

## Update chart data

To update your chart, you should modify the React state:

```tsx
import React, { useState } from 'react';
import { Chart, Series } from '@highcharts/react';

export default function MyChart() {
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  const updateData = () => {
    setData([5, 4, 3, 2, 1]);

    // Avoid direct chart updates.
    // chartRef.current.chart.series[0].setData([5, 4, 3, 2, 1]);
  };

  return (
    <Chart>
      <Series data={data} />
    </Chart>
  );
}
```

> **Note:** Direct chart updates are not recommended as they bypass React's state management, causing inconsistencies between your state and the displayed chart.

## Data mutation

By default, Highcharts mutates chart data for performance and memory efficiency (controlled by [allowMutatingData](https://api.highcharts.com/highcharts/chart.allowMutatingData)). The React integration disables this behavior to follow React's immutability principles and keep state read-only. If needed, you can adjust it:

```tsx
import React, { useState } from 'react';
import { Chart, Series } from '@highcharts/react';

const CHART_OPTIONS = {
  chart: {
    allowMutatingData: true
  }
};

export default function MyChart() {
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  return (
    <Chart options={CHART_OPTIONS}>
      <Series data={data} />
    </Chart>
  );
}
```
