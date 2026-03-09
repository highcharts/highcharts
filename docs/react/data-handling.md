# Data handling

## Store chart data

For organizing your data, you should follow React [principles](https://react.dev/learn/choosing-the-state-structure#principles-for-structuring-state) as a foundation.

You should store **dynamic data** that changes over time in state, and keep **static configuration** as constants or inline within your components:

```tsx
import React, { useState } from "react";
import { Chart, Title, PlotOptions, Series } from "@highcharts/react";

export default function MyChart() {
  const [series, setSeries] = useState({
    data: [1, 2, 3, 4, 5],
    options: {
      color: "green",
    },
  });

  return (
    <Chart>
      <Title>My Chart</Title>
      <PlotOptions
        series={{
          dataLabels: {
            enabled: true,
            format: "{y}",
          },
        }}
      />
      <Series data={series.data} options={series.options} />
    </Chart>
  );
}
```

> **Note:** What qualifies as **dynamic data** depends on your use case. Store configuration in state if it needs to change over time. Otherwise, use constants.

## Update chart data

To update your chart, you should modify the React state:

```tsx
// Pattern: state → props → rerender
import React, { useRef, useState } from "react";
import { Chart, Series, Title } from "@highcharts/react";

export default function MyChart() {
  const [title, setTitle] = useState("Initial title");
  const [points, setPoints] = useState([1, 2, 3, 4, 5]);

  const chartRef = useRef(null);

  const updateTitle = () => {
    setTitle("Updated title");

    // Avoid direct chart updates.
    // chartRef.current.chart.setTitle({ text: 'Updated title' });
  };

  const updatePoints = () => {
    setPoints([5, 4, 3, 2, 1]);

    // Avoid direct chart updates.
    // chartRef.current.chart.series[0].setData([5, 4, 3, 2, 1]);
  };

  return (
    <>
      <Chart ref={chartRef}>
        <Title>{title}</Title>
        <Series data={points} />
      </Chart>

      <button onClick={updateTitle}>Change title</button>
      <button onClick={updatePoints}>Shift data</button>
    </>
  );
}
```

**Live demos:**

- <a href="https://www.highcharts.com/samples/embed/highcharts/react/reactive" target="_blank" rel="noreferrer">reactive</a>
- <a href="https://www.highcharts.com/samples/embed/highcharts/react/reactive-title" target="_blank" rel="noreferrer">reactive-title</a>

> **Note:** Direct chart updates are not recommended as they bypass React's state management, causing inconsistencies between your state and the displayed chart.

## Add series dynamically

Because `Series` components are regular React components, you can create them from
state or props. This makes it straightforward to add new series at runtime:

```jsx
import React from "react";
import { Chart, Series, Subtitle, Title } from "@highcharts/react";

const seriesCatalog = [
  { id: "line", name: "Line", type: "line", data: [5, 7, 6, 8, 9] },
  { id: "area", name: "Area", type: "area", data: [3, 4, 3, 5, 6] },
  { id: "column", name: "Column", type: "column", data: [2, 3, 4, 3, 5] },
];

export default function ChartComponent() {
  const [activeSeriesIds, setActiveSeriesIds] = React.useState(() => [
    seriesCatalog[0].id,
  ]);

  const toggleSeries = React.useCallback((seriesId) => {
    setActiveSeriesIds((current) => {
      if (current.includes(seriesId)) {
        return current.filter((id) => id !== seriesId);
      }

      return [...current, seriesId];
    });
  }, []);

  const activeSeries = React.useMemo(
    () => seriesCatalog.filter((series) => activeSeriesIds.includes(series.id)),
    [activeSeriesIds],
  );

  return (
    <div className="dynamic-basics-demo">
      <Chart>
        {/* ... chart options ... */}
        {activeSeries.map((series) => (
          <Series
            key={series.id}
            type={series.type}
            data={series.data}
            options={{
              ...series.options,
              id: series.id,
              name: series.name,
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
[dynamic React indicators](https://www.highcharts.com/samples/highcharts/react/dynamic-indicators) sample.

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/dynamic-basics" title="Dynamic series chart demo showing add/remove series on user input"></iframe>

## Data mutation

By default, Highcharts treats your data as immutable and keeps state read-only. Increased performance with large datasets can be achieved by allowing Highcharts to mutate the data:

```tsx
import React, { useState } from "react";
import { Chart, Series } from "@highcharts/react";

export default function MyChart() {
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  return (
    <Chart
      options={{
        chart: {
          allowMutatingData: true,
        },
      }}
    >
      <Series data={data} />
    </Chart>
  );
}
```
