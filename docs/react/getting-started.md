# Getting started

## Requirements

The release has been tested with:

- The [Highcharts npm package](https://www.npmjs.com/package/highcharts) version 11.4.8 and newer
- [Vite](https://vite.dev/) with [plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) version 4.3.3 and newer
- React and react-dom version 18.3.1 and newer

## 1. Install the Highcharts React integration:

Install our Highcharts [React integration](https://www.npmjs.com/package/@highcharts/react) by running:

```sh
npm install @highcharts/react
```

> **Note:** [Highcharts](https://www.npmjs.com/package/highcharts) is included as a peer dependency and is installed automatically with npm v7+.

## 2. Add basic components

Start by importing the React components you need:

```tsx
import { Chart, Title } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
```

## 3. Create your chart

Now, you can create a simple chart like this:

```tsx
export default function LineChart() {
  return (
    <Chart>
      <Title>Line chart</Title>
      <LineSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

The result should look like this:

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/basic" title="Basic Highcharts React chart example"></iframe>

## 4. Customize your chart (optional)

You can customize your chart using props and dedicated chart element components:

```tsx
import { Chart, Legend } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function ColumnChart() {
  return (
    <Chart options={{ chart: { className: "column-chart" } }}>
      <Legend>{"{index}: {name}"}</Legend>
      <ColumnSeries
        options={{ name: "Column series", color: "red" }}
        data={[3, 4, 1, 5, 2]}
      />
    </Chart>
  );
}
```

Learn more about the concepts used:

- See the [Chart](https://www.highcharts.com/docs/react/components/chart) documentation to configure your chart.
- See the [Series types](https://www.highcharts.com/docs/react/components/series-types) documentation to work with different series types.
- See the [Legend](https://www.highcharts.com/docs/react/components/chart-elements/legend) documentation as an example of working with chart elements.

## 5. Load modules (optional)

You can load additional Highcharts modules using dedicated React components:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { Accessibility } from "@highcharts/react/modules/accessibility";
import { Exporting } from "@highcharts/react/modules/exporting";

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

To explore supported modules, see the [Modules components](https://www.highcharts.com/docs/react/components/modules/accessibility) documentation. If you need a module that isn’t supported yet, you can import it directly from Highcharts:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

import "highcharts/esm/modules/draggable-points.src.js";

export default function ModulesChart() {
  return (
    <Chart>
      <LineSeries
        data={[3, 4, 1, 5, 2]}
        options={{
          cursor: "move",
          dragDrop: {
            draggableX: true,
            draggableY: true,
          },
        }}
      />
    </Chart>
  );
}
```

> **Note:** You should import additional modules using their ESM versions. See the [Bundling and tree shaking](https://www.highcharts.com/docs/react/bundling-and-tree-shaking) documentation.
