# Series and Chart components

## The Series component

The main module provides a `Series` component that can be used this way:

```jsx
import {
    Chart,
    Series
} from '@highcharts/react';

function ChartComponent () {
  return (
    <Chart>
      <Series type="column" data={[1, 2, 3]} />
    </Chart>
  )
}
```

This component can be used to render any series that is a part of the `Highcharts` bundle – or loaded separately as a module –
by setting the `type` prop.

In order to use a series that is not part of the main Highcharts bundle, you can
either [load the required module](https://www.highcharts.com/docs/react/options#setting-a-custom-highcharts-instance)
from the main `highcharts` package, or use the series component for that series.


## Series type components

For series that are outside the main Highcharts bundle, you can import their
specific components. This helps manage required imports seamlessly.

For example, to use a Venn diagram series:

```jsx
import { VennSeries } from '@highcharts/react/series/Venn';
```

Use the Venn series component just like the generic `Series`, but omit the `type` prop:

```jsx
<Chart>
  <VennSeries data={[/* your data */]} />
</Chart>
```

## Stock, Gantt and Maps charts

Highcharts React also supports Stock, Gantt and Maps charts via their own components.
Using the components will load the respective Stock, Maps or Gantt bundle including modules and series,
avoiding additional setup.

### Stock

Import the Stock chart component:
```jsx
import { StockChart } from '@highcharts/react/Stock';

export function StockChart() {
  return (
    <StockChart>
      <StockChart.Series
        type="candlestick"
        data={[
          [1609459200000, 100, 110, 90, 105],
          [1609545600000, 105, 115, 95, 110],
          [1609632000000, 110, 120, 100, 115],
        ]}
      />
    </StockChart>
  );
}
```

### Gantt

Import the Gantt chart component:
```jsx
import { GanttChart } from '@highcharts/react/Gantt';

export function GanttChart() {
  return (
    <GanttChart>
      <GanttChart.Series
        type="gantt"
        data={[
          {
            start: Date.UTC(2021, 0, 1),
            end: Date.UTC(2021, 0, 5),
            name: 'Task 1',
          },
          {
            start: Date.UTC(2021, 0, 3),
            end: Date.UTC(2021, 0, 8),
            name: 'Task 2',
          },
        ]}
      />
    </GanttChart>
  );
}
```

### Maps

Import the Map chart and its map series component:
```jsx
import { MapsChart } from '@highcharts/react/Maps';
import { MapSeries } from '@highcharts/react/series/Map';

// Fetch map data
const mapData = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json').then(res => res.ok ? res.json() : null);

export function MapsChart() {
  return (
    <MapsChart
      options={{
        chart: {
          map: mapData
        }
      }}
    >
      <MapSeries
        data={[
          { 'hc-key': 'no', value: 1 },
          { 'hc-key': 'dk', value: 2 },
          { 'hc-key': 'se', value: 3 }
        ]}
      />
    </MapsChart>
  );
}
```
