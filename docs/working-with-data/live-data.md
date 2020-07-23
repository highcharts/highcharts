Live data
=========

There are basically two ways of working with a live data feed from the server in Highcharts.

1. Use the **data module with polling**. This is the simple, configuration-only way.
2. Set up your own data connection and use Highcharts' **API methods** to keep the chart updated. This allows for more programmatic control.

## Data module with polling

This feature was introduced in v6.1. The [data module](https://www.highcharts.com/docs/working-with-data/data-module) can load data directly from files and services online, and keep the chart updated by polling the server periodically. The chart can load data through one of the [data.csv](https://api.highcharts.com/highcharts/data.csv), [data.rows](https://api.highcharts.com/highcharts/data.rows), [data.columns](https://api.highcharts.com/highcharts/data.columns) or [data.googleSpreadsheetKey](https://api.highcharts.com/highcharts/data.googleSpreadsheetKey) options, and keep it updated by setting [data.enablePolling](https://api.highcharts.com/highcharts/data.enablePolling) to true. This feature also supports flexibility to the data structure. Data points can be shifted, typically old data points removed and new ones added, and the chart will animate to visualize what changed. A benefit of using this feature is that it is purely declarative, which makes it a good match for graphical user interfaces where chart editors set up a chart based on known sources.

<iframe style="width: 100%; height: 650px; border: none;" src=https://www.highcharts.com/samples/highcharts/data/livedata-columns/ allow="fullscreen"></iframe>


## API methods

If the declarative live charts don't cut it, you can set up your own data connection. After a chart has been defined by the configuration object, optionally preprocessed and finally initialized and rendered using Highcharts.chart(), we have the opportunity to alter the chart using a toolbox of API methods. The chart, axis, series and point objects have a range of methods like update, remove, [addSeries](https://api.highcharts.com/highcharts/Chart.addSeries), [addPoint](https://api.highcharts.com/highcharts/Series.addPoint) and so on. The complete list can be seen in [class reference](https://api.highcharts.com/class-reference)

This example shows how to run a live chart with data retrieved from the server each second, or more precisely, one second after the server's last reply. This is done by setting up a custom function, requestData, that initially is called from the chart's load event, and subsequently from itself. You can see the results live at [in this sample](https://highcharts.com/samples/highcharts/data/livedata-fetch).

### Set up the server
In this case, we have a simple [Express](https://expressjs.com/) server that runs the following function every second, before serving it to [time-rows.json](https://demo-live-data.highcharts.com/time-rows.json):

```javascript
generate: (state, counter) => {
  state.rows = state.rows || [];
  state.rows.push([startDate.toISOString(), Math.random() * 10]);
  trimArray(state.rows);
  return JSON.stringify(state.rows);
}
```

### Define the chart variable globally
We do this because we want to access the variable both from the document ready function and our requestData funcion. If the chart variable is defined inside the document ready callback function, it will not be available in the global scope later.

```js
let chart; // global
```

### Set up a data request function
Here we use the [Fetch API]('https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch') to retrieve the data from the server. After successfully receiving  the data, the point is added to the chart's first series using the [addPoint method](https://api.highcharts.com/class-reference/Highcharts.Series#addPoint). If the series length is greater than 20, we shift off the first point so that the series will move to the left rather than just cram the points tighter.

```javascript
/**
* Request data from the server, add it to the graph and set a timeout to request again
*/
async function requestData() {
  const result = await fetch('https://demo-live-data.highcharts.com/time-rows.json');
  if (result.ok) {
    const data = await result.json();

    const [date, value] = data[0];
    const point = [new Date(date).getTime(), value * 10];
    const series = chart.series[0],
      shift = series.data.length > 20; // shift if the series is longer than 20

    // add the point
    chart.series[0].addPoint(point, true, shift);
    // call it again after one second
    setTimeout(requestData, 1000);
  }
}
```
    

### Create the chart
Notice how our requestData function is initially called from the chart's load event. The initial data is an empty array.

```js
window.addEventListener('load', function () {
  chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      defaultSeriesType: 'spline',
      events: {
        load: requestData
      }
    },
    title: {
      text: 'Live random data'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150,
      maxZoom: 20 * 1000
    },
    yAxis: {
      minPadding: 0.2,
      maxPadding: 0.2,
      title: {
        text: 'Value',
        margin: 80
      }
    },
    series: [{
      name: 'Random data',
      data: []
    }]
  });
});
```