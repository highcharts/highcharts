# Getting started

## Requirements

The release has been tested with:

- The [Highcharts npm package](https://www.npmjs.com/package/highcharts) version 11.4.8 and newer
- [Vite](https://vite.dev/) with [plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) version 4.3.3 and newer
- React and react-dom version 18.3.1 and newer

## 1. Install Highcharts and highcharts-react from npm

Install the Highcharts package along with our [React integration](https://www.npmjs.com/package/@highcharts/react) from npm by running:

```sh
npm install highcharts @highcharts/react
```

## 2. Add basic components

In your JSX file, import the components that you need:

```jsx
import { Chart, Series, Title } from "@highcharts/react";
```

## 3. Create your chart

Now, you can create a simple chart like this:

```jsx
function ChartComponent() {
  return (
    <Chart>
      <Title>Line chart</Title>
      <Series data={[1, 2, 3]} />
    </Chart>
  );
}
```

## 4. Loading modules (optional)

If you wish to load additional Highcharts modules, use the `setHighcharts` function:

```jsx
import { Chart, setHighcharts } from "@highcharts/react";

import Highcharts from "highcharts/highcharts";
import "highcharts/modules/exporting";
import "highcharts/modules/accessibility";

setHighcharts(Highcharts);

export function ChartWithCustomHC() {
  return (
    <Chart>
      <Series data={[1, 2, 3, 4, 5]} />
    </Chart>
  );
}
```

For more in-depth information on configuring your chart, see the [Components](https://www.highcharts.com/docs/react/components/chart) documentation.

The result should look like this:

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/basic" title="Basic Highcharts React chart example"></iframe>
