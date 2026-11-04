---
description: >-
  Load the Boost module with its React component, pass boost API options as
  props, and use it in a chart with a large data series such as the
  50,000-point example.
---

# Boost

You can add the [boost module](https://www.highcharts.com/docs/advanced-chart-features/boost-module) to your chart using the `Boost` component:

```tsx
import { useState } from 'react';
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { Boost } from "@highcharts/react/modules/Boost";

export default function BoostChart() {
  const [data] = useState(() => {
    let value = 0;
    return Array.from({ length: 50000 }, () => {
      value += Math.round((Math.random() - 0.5) * 10);
      return value;
    });
  });

  return (
    <Chart>
      <Boost />
      <LineSeries data={data} />
    </Chart>
  );
}
```

The `Boost` component accepts all [boost API options](https://api.highcharts.com/highcharts/boost) as props.
