Understanding Common Highcharts Events
===


Highcharts provides a flexible event system that allows you to add interactivity and custom behavior to charts and their elements. This guide highlights the most common and useful events in Highcharts and explains how to work with them effectively.


## Common Events

### 1. Chart Load Event

The `load` event is triggered when the chart is fully loaded. It’s an excellent opportunity to perform any initial setup or modifications.

```javascript
Highcharts.chart('container', {
    chart: {
        events: {
            load: function() {
                alert('Chart has loaded');
            }
        }
    },
    series: [{
        data: [1, 2, 3, 4]
    }]
});
```
 * [Demo](https://api.highcharts.com/highcharts/chart.events.load)
 * [API option](https://api.highcharts.com/highcharts/chart.events.load)

### 2. Chart Render Event

The `render` event occurs every time the chart is redrawn. It’s useful for updating elements, running calculations based on the current chart state, and drawing custom responsive elements.

```javascript
let renderCount = 0;


Highcharts.chart('container', {
    chart: {
        events: {
            render: function () {
                renderCount++;
                console.log(`Chart has rendered ${renderCount} times`);
            }
        }
    },
    series: [{
        data: [1, 2, 3, 4]
    }]
});
```
 * [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/renderer-on-chart/)
 * [API option](https://api.highcharts.com/highcharts/chart.events.render)

### 3. Chart Selection Event

The `selection` event fires when a user selects an area on the chart, typically for zooming. It’s useful for getting the exact coordinates of the selected area.

```javascript
Highcharts.chart("container", {
  chart: {
    zooming: { 
        type: "x" 
    },
    events: {
      selection(e) {
        const text = e.xAxis
          ? `From ${e.xAxis[0].min} to ${e.xAxis[0].max}`
          : "";
        this.setSubtitle({ text });
      },
    },
  },
  series: [
    {
      data: [1, 2, 3, 4],
    },
  ],
});
```
 * [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/chart/events-selection/)
 * [API option](https://api.highcharts.com/highcharts/chart.events.selection)

### 4. Point Click Event

The `click` event on a point is triggered when the user clicks on a specific data point. You can use this to display additional information or perform actions based on the clicked point.

```javascript
Highcharts.chart("container", {
  plotOptions: {
    series: {
      point: {
        events: {
          click: function () {
            alert("You clicked on point: " + this.index)
          },
        },
      },
    },
  },
  series: [
    {
      data: [1, 2, 3, 4],
    },
  ],
});
```
 * [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-point-events-click/)
 * [API option](https://api.highcharts.com/highcharts/plotOptions.series.point.events.click)

### 5. Legend Item Click Event

The legend `itemClick` event triggers when a user clicks a legend item, typically toggling a series’ visibility. You can prevent this default action by returning `false` or calling `event.preventDefault()` to implement custom behavior instead.

```javascript
Highcharts.chart('container', {
  legend: {
    events: {
      itemClick: function (e) {
        const visibility = e.legendItem.visible ? 'visible' : 'hidden'
        if (
          !confirm(
            'The series is currently ' +
              visibility +
              '. Do you want to change ' +
              'that?',
          )
        ) {
          return false
        }
      },
    },
  },
  series: [
    {
      data: [1, 2, 3, 4],
    },
  ],
});
```
 * [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/legend/pie-legend-itemclick/)
 * [API option](https://api.highcharts.com/highcharts/legend.events.itemClick)

## Event Handler Arguments

Each handler receives an `event` object containing details about the interaction.
Common properties include cursor coordinates (`chartX`, `chartY`), axis ranges, and the target element.
The `this` context refers to the element that triggered the event (`chart`, `series`, or `point`).

```javascript
Highcharts.chart("container", {
  chart: {
    events: {
      click: function (event) {
        console.log("Mouse X:", event.chartX, "Mouse Y:", event.chartY)
      },
    },
  },
  series: [
    {
      data: [1, 2, 3, 4],
    },
  ],
});
``` 
* [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/chart/events-click/)
* [API](https://api.highcharts.com/highcharts/chart.events.click)

## Dealing with Promises and Asynchronous Data in Highcharts

Highcharts doesn’t natively support promises in its configuration, as it expects data to be available when Highcharts.chart() is called. To handle asynchronous data, use `fetch()` or other promise-based APIs to load data first, then create the chart or update it using `chart.series[0].setData(newData)` or `chart.update()`.

If the chart needs to refresh dynamically (for example, after user input or an event), trigger a re-render with `chart.redraw()`. Loading data asynchronously, especially for maps or large datasets, improves performance and ensures a smoother user experience.

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/data/livedata-fetch" allow="fullscreen"></iframe>

 * [Checkout Live-data](https://www.highcharts.com/docs/working-with-data/live-data)