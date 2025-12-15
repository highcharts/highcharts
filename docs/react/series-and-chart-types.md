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

## Add series dynamically

Because `Series` components are regular React components, you can create them from
state or props. This makes it straightforward to add new series at runtime:

```jsx
import React from 'react';
import { Chart, Series, Subtitle, Title } from '@highcharts/react';

const seriesCatalog = [
  { id: 'line', name: 'Line', type: 'line', data: [5, 7, 6, 8, 9] },
  { id: 'area', name: 'Area', type: 'area', data: [3, 4, 3, 5, 6] },
  { id: 'column', name: 'Column', type: 'column', data: [2, 3, 4, 3, 5] }
];

export default function ChartComponent() {
    const [activeSeriesIds, setActiveSeriesIds] = React.useState(() => [seriesCatalog[0].id]);

    const toggleSeries = React.useCallback(seriesId => {
        setActiveSeriesIds(current => {
            if (current.includes(seriesId)) {
                return current.filter(id => id !== seriesId);
            }

            return [...current, seriesId];
        });
    }, []);

    const activeSeries = React.useMemo(
        () => seriesCatalog.filter(series => activeSeriesIds.includes(series.id)),
        [activeSeriesIds]
    );

    return (
        <div className="dynamic-basics-demo">
            <Chart>
            {/* ... chart options ... */}
            {activeSeries.map(series => (
                <Series
                    key={series.id}
                    type={series.type}
                    data={series.data}
                    options={{
                            ...series.options,
                            id: series.id,
                            name: series.name
                        }}
                    />
                ))}
            </Chart>

            <SeriesControls
                activeSeriesIds={activeSeriesIds}
                onToggleSeries={toggleSeries}
            />
        </div>
    );
}
```

This basic example uses the generic `Series` component for built-in chart types. For a more advanced
pattern that wires up Stock indicators dynamically, see the dedicated
[`Dynamic React indicators` sample](https://www.highcharts.com/samples/highcharts/react/dynamic-indicators).

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/dynamic-basics"></iframe>


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

### Bubble

Use the `BubbleSeries` component for bubble charts. Data points are three-dimensional tuples `[x, y, z]`.

```jsx
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
```

**Live demo:**

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/bubble"></iframe>


**Live demo:**

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/venn-diagram"></iframe>
