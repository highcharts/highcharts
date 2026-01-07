# Setting options

## Configure with option components

The Highcharts React integration includes customizable components such as
Title, Subtitle, Credits, Tooltip, Legend, XAxis, YAxis, and PlotOptions,
providing flexible options to configure and fine-tune your charts using JSX.

Enhance your chart by adding option components:

```jsx
import {
    Title,
    Subtitle,
    Credits,
    XAxis,
    YAxis,
    PlotOptions,
    Tooltip,
    Legend
} from '@highcharts/react';
```

Here's an example of adding a custom title:

```jsx
<Chart>
  <Title>Custom Chart Title</Title>
  <Series type="column" data={[1, 2, 3]} />
</Chart>
```

Most top-level properties can be set as props. If an option component has a `text` or `format` property,
you can set it by passing children to the component. In most cases, a component that accepts strings as children will be formatted
as a [format string in Highcharts](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#format-strings).

### Container props

The chart is rendered inside a `<div>` container. Use `containerProps` to pass
React props to that container (for example width/height, `className`, or data
attributes):

```jsx
<Chart
  containerProps={{
    className: 'chart-shell',
    style: { width: '100%', height: '100%' }
  }}>
  <Series type="line" data={[1, 2, 3]} />
</Chart>
```

With the `Tooltip` component, you can customise the information displayed using a [format string](https://www.highcharts.com/docs/chart-concepts/templating). Here's a simple example:

```jsx
<Chart>
  <Series type="column" data={[1, 2, 3]} />

  <Tooltip>{'X: {point.x}, Y: {point.y}'}</Tooltip>
</Chart>
```

If you prefer more flexibility, you can use React components and elements as children:

```jsx
function TooltipFormat() {
  return (
    <>
      <div data-hc-option="headerFormat">
        <strong>{'Series {series.name}'}</strong>
      </div>
      <div data-hc-option="pointFormat">
        {'X: {point.x}, Y: {point.y}'}
      </div>
      <div data-hc-option="footerFormat">
        <em>Footer text</em>
      </div>
    </>
  );
}

function ChartComponent() {
  return (
    <Chart>
      <Series type="column" data={[1, 2, 3]} />

      <Tooltip>
        <TooltipFormat />
      </Tooltip>
    </Chart>
  );
}
```

**Note:** The `data-hc-option` attributes links the elements to `tooltip.headerFormat`, `tooltip.pointFormat`, and `tooltip.footerFormat`.

### More option components

In addition to the core option components mentioned above, there is also `Accessibility`, `Exporting`, and `Data`.
What sets these components apart is that they load their respective modules when imported.

You can create a chart using these modules like this:

```jsx

import { Chart, Series } from '@highcharts/react';

import { Accessibility } from '@highcharts/react/options/Accessibility';
import { Data } from '@highcharts/react/options/Data';
import { Exporting } from '@highcharts/react/options/Exporting';

function ChartComponent() {
  return (
    <Chart>
      <Accessibility />
      <Exporting />
      <Data
        rows={[
            [null, 'Ola', 'Kari'], // series names
            ['Apples', 1, 5], // category and values
            ['Pears', 4, 4], // category and values
            ['Oranges', 3, 2] // category and values
        ]}
      />
    </Chart>
  );
}
```

## Setting options using the `options` prop

Alternatively, you can configure your chart using the `options` prop:

```jsx
<Chart options={chartOptions} />
```

This method allows you to define chart types, data, and specific Highcharts configurations within a single object.

## Accessing the Highcharts instance

If you need to set global Highcharts options or use global methods, access the `Highcharts` export:

```jsx
import { Highcharts } from '@highcharts/react';

Highcharts.setOptions({
    chart: {
        animation: false
    }
});

export default function MyChartComponent(){
  // Your component code
}
```

**Note:** Setting global options will affect all charts rendered using the Highcharts instance, so use this feature thoughtfully.

## Setting a custom Highcharts instance
If you need to load additional modules or use a specific Highcharts version, you can provide a
custom Highcharts instance. This can be accomplished via the `setHighcharts` function:

```jsx
import { Chart, setHighcharts } from '@highcharts/react';

import Highcharts from 'highcharts/highcharts';
import 'highcharts/modules/exporting';
import 'highcharts/modules/accessibility';

setHighcharts(Highcharts);

export function ChartWithCustomHC () {
  return (
      <Chart>
        <Series
          type="line"
          data={[1, 2, 3, 4, 5]}
        />
      </Chart>
    );
}
```
