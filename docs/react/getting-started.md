---
description: >-
  Install @highcharts/react, create a chart with a series component, add chart
  elements or module components, and use the linked guides for chart options,
  series types, and bundling.
---

# Getting started

> **Tip:** Want to see what's new? Check the [Highcharts React changelog](https://github.com/highcharts/highcharts-react/blob/master/CHANGELOG.md) for the latest features, improvements, and fixes.

## Requirements

The release has been tested with:

- The [Highcharts npm package](https://www.npmjs.com/package/highcharts) version 12.0.0 and newer
- [Vite](https://vite.dev/) with [plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) version 4.3.3 and newer
- React and react-dom version 18.3.1 and newer

## 1. Install Highcharts React

Install [Highcharts React](https://www.npmjs.com/package/@highcharts/react) by running:

```sh
npm install @highcharts/react
```

> **Note:** [Highcharts](https://www.npmjs.com/package/highcharts) is included as a peer dependency and is installed automatically with npm v7+.

## 2. Create your chart

Start by creating a simple chart using a series component:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function LineChart() {
  return (
    <Chart>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

## 3. Customize your chart

Highcharts React provides dedicated React components for chart elements and modules to customize your chart.

### Chart elements

Combine series and chart elements, then update the data through React state:

```tsx
import { useState } from "react";
import { Chart, Title, Tooltip, XAxis, YAxis } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";
import { LineSeries } from "@highcharts/react/series/Line";
import { Accessibility } from "@highcharts/react/modules/Accessibility";

export default function SalesChart() {
  const [sales, setSales] = useState([3, 4, 1]);

  const increaseSales = () => {
    setSales((values) => values.map((value) => value + 1));
  };

  return (
    <>
      <Chart>
        <Title>Monthly sales and target</Title>
        <XAxis categories={["January", "February", "March"]}>Month</XAxis>
        <YAxis min={0}>Sales (units)</YAxis>
        <Tooltip shared valueSuffix=" units" />
        <Accessibility />
        <ColumnSeries name="Sales" data={sales} />
        <LineSeries name="Target" data={[4, 4, 4]} />
      </Chart>
      <button type="button" onClick={increaseSales}>
        Increase sales
      </button>
    </>
  );
}
```

Learn more about the concepts used:

- See the [Chart](https://www.highcharts.com/docs/react/components/chart) documentation to configure your chart.
- See the [Series types](https://www.highcharts.com/docs/react/components/series-types) documentation to work with different series types.
- See the [Tooltip](https://www.highcharts.com/docs/react/components/chart-elements/tooltip) documentation to customize displayed values.

For another example of chart elements:

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/basic" title="Basic Highcharts React chart example"></iframe>

### Modules (optional)

You can use module components to load additional Highcharts modules:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { Exporting } from "@highcharts/react/modules/Exporting";

export default function ModulesChart() {
  return (
    <Chart>
      <Accessibility />
      <Exporting />
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

> **Note:** Each component automatically includes the corresponding Highcharts module.

To explore modules with dedicated components, see the [Module components](https://www.highcharts.com/docs/react/components/modules/accessibility) documentation. If a module doesn't have a dedicated component, we recommend importing it directly from Highcharts using its ESM version:

```tsx
import { Chart, YAxis } from "@highcharts/react";
import { ScatterSeries } from "@highcharts/react/series/Scatter";

import "highcharts/es-modules/masters/modules/marker-clusters.src.js";

export default function MarkerClustersChart() {
  return (
    <Chart>
      <YAxis min={0} max={10} />
      <ScatterSeries
        data={[
          [1, 4],
          [1, 5],
          [1, 6],
        ]}
        cluster={{ enabled: true }}
      />
    </Chart>
  );
}
```

> **Note:** For more information on ESM imports, see the [Bundling and tree shaking](https://www.highcharts.com/docs/react/bundling-and-tree-shaking) documentation.
