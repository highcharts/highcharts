# Getting started

## Requirements

The release has been tested with:

* The [Highcharts npm package](https://www.npmjs.com/package/highcharts) version 11.4.8 and newer
* [Vite](https://vite.dev/) with [plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) version 4.3.3
* React and react-dom version 18.3.1

## 1. Install Highcharts and highcharts-react from npm

Install the Highcharts package along with our [React integration](https://www.npmjs.com/package/@highcharts/react) from npm by running:

```sh
npm install highcharts @highcharts/react
```

## 2. Add Chart, Series and Title components

In your JSX file, import the necessary components:

```jsx
import {
    Chart,
    Series,
    Title
} from '@highcharts/react';
```

## 3. Create your chart

Now, you can create a simple chart like this:

```jsx
function ChartComponent () {
  return (
    <Chart>
      <Title>Line chart</Title>
      <Series type="line" data={[1, 2, 3]} />
    </Chart>
  )
}
```

For more in-depth information on configuring your chart, see the documentation
for the [Chart and Series](https://www.highcharts.com/docs/react/series-and-chart-types) components,
and [how to set options](https://www.highcharts.com/docs/react/options).


The result should look like this:

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/basic" style="width: 100%; height: 800px; border: 0;" > </iframe>
