# Chart instance

If you need to access the specific chart instance, you can use the `ref` prop.
The `ref` prop will be passed a reference to the chart instance, as well as the
chart container element.

```tsx
import { useEffect, useRef } from "react";
import { Chart, type HighchartsReactRefObject } from "@highcharts/react";

function RefExample() {
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

Highcharts React creates the chart once and then applies your options to that same instance with `chart.update()` on every later render. The chart is not torn down and rebuilt, which is what lets you drive it from React state. This is the library updating itself from the props you pass, which is not the same as calling chart methods yourself: see [Update chart data](https://www.highcharts.com/docs/react/data-handling#update-chart-data) for why reaching for the instance to change what the chart shows is discouraged.

One consequence is worth knowing: a parent component that re-renders for reasons unrelated to the chart still triggers a chart update. If that happens often, wrap the chart component in [`React.memo`](https://react.dev/reference/react/memo) so those renders stop at the component boundary.

```tsx
import { memo } from "react";
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

const PriceChart = memo(function PriceChart() {
  return (
    <Chart>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
});
```

## Chart events

A chart emits events such as `redraw`, `load`, and `selection`. With a ref to the chart instance, you can subscribe to any of them using `Highcharts.addEvent`.

Attach the handler in `useEffect` and remove it from the cleanup function, using the remover that `addEvent` returns:

```tsx
import { useEffect, useRef } from "react";
import {
  Chart,
  Highcharts,
  type HighchartsReactRefObject
} from "@highcharts/react";

function EventExample() {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    const chart = chartRef.current?.chart;

    if (!chart) {
      return;
    }

    const removeEvent = Highcharts.addEvent(
      chart,
      "redraw",
      function (this: Highcharts.Chart) {
        // `this` is the chart that fired the event.
      }
    );

    return () => removeEvent();
  }, []);

  return <Chart ref={chartRef} />;
}
```

A callback that reads `this` has to be a regular function. An arrow function captures `this` from the surrounding scope instead of receiving the object that fired the event. In TypeScript, give the callback an explicit `this` parameter so its type is known, as above.
