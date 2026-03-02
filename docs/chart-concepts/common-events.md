# Understanding Common Highcharts Events

Highcharts provides a flexible event system that allows you to add interactivity and custom behavior to charts and their elements. This guide highlights the most common and useful events in Highcharts and explains how to work with them effectively.

Before looking at individual events, it is important to understand that **there are several different ways to attach event handlers in Highcharts**. Which one you choose depends on your use case.

## Ways to Attach Events in Highcharts

Events can be registered in several ways depending on whether the configuration is static, dynamic, or intended to be reused across multiple charts.

| Method | Scope | Best For | Supports JSON Config? | Example |
|--------|------|---------|----------------------|---------|
| **In Configuration** | One chart | Custom, chart-specific behavior | ❌ No (functions cannot be stored in JSON) | `chart.events.load` |
| **On a Component Instance (Chart, Series, Point etc.)** | One already-created chart | When config is loaded from backend / editable UI | ✅ Yes | `Highcharts.addEvent(chart, 'render', ...)` |
| **On a Highcharts Class** | All charts of a type | Plugin-style reusable logic | ✅ Yes | `Highcharts.addEvent(Highcharts.Series, 'legendItemClick', ...)` |

### When to Choose Each Method

- Use **in configuration** when defining interaction directly in your implementation for a specific chart.
- Use **instance-level** when chart config is provided as pure JSON.
- Use **class-level** when you want consistent behavior across multiple charts, or when writing extensions/plugins.

### Code Examples

#### A) In Configuration (most common)

```javascript
Highcharts.chart('container', {
  chart: {
    events: {
      load() {
        console.log('Chart loaded');
      }
    }
  }
});
```

#### B) On a Chart Instance

```javascript
const chart = Highcharts.chart('container', {
  series: [{ data: [1, 2, 3] }]
});

Highcharts.addEvent(chart, 'render', function () {
  console.log('Rendered (instance)');
});
```

#### C) On a Class (applies to all charts/series/points)

```javascript
Highcharts.addEvent(Highcharts.Series, 'legendItemClick', function () {
  console.log('Legend clicked:', this.name);
});
```

* Checkout **[Extending Highcharts](https://www.highcharts.com/docs/extending-highcharts/extending-highcharts)** docs

---

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

### Arrow Functions and Callback Context

For user-supplied option callbacks, Highcharts provides an explicit context
argument (typically named `ctx`). The `ctx` argument is always passed as the
last callback argument: `callback(arg1, arg2, ..., ctx)`. This makes arrow
functions a first-class option without losing access to callback context:

```javascript
labels: {
  formatter: (ctx) => `Value: ${ctx.value}`
}
```

Regular functions are still supported:

```javascript
labels: {
  formatter: function () {
    return `Value: ${this.value}`;
  }
}
```

For lower-level extension hooks (for example `addEvent` and `wrap`), `this`
binding still matters, so regular functions are recommended there.

## Dealing with Promises and Asynchronous Data in Highcharts

Highcharts expects data to be available when `Highcharts.chart()` runs. However, loading data asynchronously is very common. In these cases, the chart is typically initialized with **empty or placeholder data**, and the real data is added once it has been fetched.

There are two main approaches:
1. **Fetch the data before creating the chart**, then pass it directly into `Highcharts.chart()`, or  
2. **Create the chart first and update it when the data arrives**, which is useful for live or continuously updating data.

A typical pattern is to load data using `fetch()` (or any async API) and then update the chart using `series.setData()` or `series.addPoint()`. These methods trigger a redraw automatically. If multiple updates are batched together for performance reasons, you can call `chart.redraw()` manually after applying them.

Asynchronous loading is especially beneficial for large datasets or map visualizations, where deferring the data request improves performance and keeps the UI responsive.

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/data/livedata-fetch" allow="fullscreen"></iframe>

* Checkout **[Live data](https://www.highcharts.com/docs/working-with-data/live-data)** docs
