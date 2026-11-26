---
description: >-
  Use the ref prop on Chart to obtain a reference to the underlying chart
  instance and its container element, then access those values from a React
  effect when needed.
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
