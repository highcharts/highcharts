---
description: >-
  Use the ref prop on Chart to reach the underlying chart instance and its
  container, learn when a re-render updates the chart, and subscribe to chart
  events on the instance with addEvent from a React effect.
---

# Chart instance

If you need to access the specific chart instance, you can use the `ref` prop.
The `ref` prop will be passed a reference to the chart instance, as well as the
chart container element.

```tsx
import { useEffect, useRef } from "react";
import { Chart, type HighchartsReactRefObject } from "@highcharts/react";

export default function RefExample() {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    if (chartRef.current?.chart) {
      // Access the chart instance.
    }
    if (chartRef.current?.container) {
      // Access the chart container element.
    }
  }, []);

  return <Chart ref={chartRef} />;
}
```

## Updates on re-render

Highcharts React creates the chart once and then updates that same instance with `chart.update()` instead of rebuilding it. A chart with children is updated every time its component renders, including when a parent component re-renders for reasons unrelated to the chart, because React creates the children anew on each render. A chart configured only through props is updated when one of its props changes, and an `options` object created during render, such as an inline object literal, counts as a change on every render.

To change what the chart shows, change its props from React state, as described in [Update chart data](https://www.highcharts.com/docs/react/data-handling#update-chart-data).

Changes made through the chart instance are overwritten the next time the chart updates from its props. Data set with `setData`, for example, is replaced by the data in your props.

## Subscribing to events on the instance

Chart-level event handlers usually go in `chart.events` through the `options` prop. See [Common events](https://www.highcharts.com/docs/chart-concepts/common-events#ways-to-attach-events-in-highcharts) for the ways to attach them.

To subscribe on the chart instance instead, use `Highcharts.addEvent` with the instance from the ref. Attach the handler in `useEffect` and remove it in the cleanup function, using the remover that `addEvent` returns. Events that fire while the chart is created, such as `load`, have already fired when the effect runs.

```tsx
import { useEffect, useRef } from "react";
import {
  Chart,
  Highcharts,
  type HighchartsReactRefObject
} from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function EventExample() {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    const chart = chartRef.current?.chart;

    if (!chart) {
      return;
    }

    const removeEvent = Highcharts.addEvent(
      chart,
      "redraw",
      function () {
        // `this` is the chart that fired the event.
      }
    );

    return () => removeEvent();
  }, []);

  return (
    <Chart ref={chartRef}>
      <LineSeries data={[3, 4, 1]} />
    </Chart>
  );
}
```
