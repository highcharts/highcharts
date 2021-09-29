How to set options
===

Highcharts use a JavaScript object structure to define the options or settings of a chart. This article explains how the options object works and how to use it.

The options object
------------------

When you initialize the chart using its constructor [Highcharts.Chart](https://api.highcharts.com/highcharts#Highcharts.Chart()), the options object is the first parameter you pass.

In the example below the code marked as red represents the options object:

```js
var chart1 = Highcharts.chart({
    chart: {
        renderTo: 'container',
        type: 'bar'
    },
    title: {
        text: 'Fruit Consumption'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
    },
    yAxis: {
        title: {
            text: 'Fruit eaten'
        }
    },
    series: [{
        name: 'Jane',
        data: [1, 0, 4]
    }, {
        name: 'John',
        data: [5, 7, 3]
    }]
});
```


To get the most out of Highcharts, it is important to understand how the options object works and how it can be altered programmatically. These are some key concepts on JavaScript objects:

*   The Highcharts options in the examples are defined as object literals. By notating the configuration this way, we can have a clean, human readable and low space consuming config object. The following complicated code is perhaps more familiar to developers with a background from C-type languages:

```js
// Bad code:
var options = new Object();

options.chart = new Object();
options.chart.renderTo = 'container';
options.chart.type = 'bar';

options.series = new Array();
options.series[0] = new Object();
options.series[0].name = 'Jane';
options.series[0].data = new Array(1, 0, 4);
```

As JavaScript object literals, we would write it like below. Note that the two options objects will produce exactly the same result.

```js
// Good code:
var options = {
    chart: {
        renderTo: 'container',
        type: 'bar'
    },
    series: [{
        name: 'Jane',
        data: [1, 0, 4]
    }]
};
```

In the example above the options object is created by itself and can be added to the chart by passing it to the chart constructor:

```js
var chart = new Highcharts.Chart(options);
```

*   After an object is created using the object literal notation, we can extend its members by the dot notation. Say we have an object like defined in the "Good code" above. The code below adds another series to it. Remember options.series is an array, so it has a push method.

```js
options.series.push({
    name: 'John',
    data: [3, 4, 2]
})
```


*   Another fact that can come in handy when working on JavaScript objects, is that the dot notation and square bracket notation are equivalent, so you can access all members by their string names. Which in practice means that `options.charts.renderTo` is always the same as: `options['charts']['renderTo']`

Global Options
--------------

If you want to apply a set of options to all charts on the same page, use `Highcharts.setOptions` like shown below. 

```js
Highcharts.setOptions({
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
        borderWidth: 2,
        plotBackgroundColor: 'rgba(255, 255, 255, .9)',
        plotShadow: true,
        plotBorderWidth: 1
    }
});

var chart1 = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
    },

    xAxis: {
        type: 'datetime'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000 // one hour
    }]
});

var chart2 = new Highcharts.Chart({
    chart: {
        renderTo: 'container2',
        type: 'column'
    },

    xAxis: {
        type: 'datetime'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000 // one hour
    }]
});
```


Note: The themes supplied with Highcharts download use this function. See [Themes](https://highcharts.com/docs/chart-design-and-style/themes) for more information.

For a full reference of the options available, see the [Highcharts options reference](https://api.highcharts.com/highcharts) or the [Highcharts Stock options reference](https://api.highcharts.com/highstock).
