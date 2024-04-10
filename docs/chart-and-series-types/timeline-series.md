Timeline chart
===

A Timeline chart visualizes important events over a time span. Charts with a Timeline series display every data point as a separate event along a horizontal or vertical line. The Timeline series is also referred to as a Timeline Diagram.

For each point defined in the timeline series, a flag is placed with a descriptive text. It is advised, to place the longer descriptions of an event in the tooltip. The description will then be visible on hovering the points. By default, the tooltip will show text specified for the `description` property of the data series point.

Getting started
---------------

Timeline series requires loading both the Highcharts and the `timeline.js` module.

Here is an example for loading Timeline into a webpage:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/timeline.js"></script>
```
Data format
-----------

The events in the Timeline chart can be visualized in two ways:

1.  By dividing the timeline into even time periods for the number of data points specified in the series data.
2.  By placing events tied to a datetime axis. Then it’s showing the exact time intervals between all points.

The Timeline series data is structured differently for the above alternatives for visualizing Timeline charts.

### Data series for a Timeline chart with time periods

The data series has no `x`property set.

    
     data: [{
        name: 'Some date',
        label: 'Event label',
        description: 'Description of this event.'
    }, {
        name: 'Another date',
        label: 'Another event label',
        description: 'Description of second event'
    }] 

### Events tied to a datetime axis

To place events on a datetime axis, the `x` property can be set with a timestamp in milliseconds since 1970.

Example of data series:

    
    data: [{
        x: 1514764800000,
        name: 'Event name',
        label: 'Event label',
        description: 'Description of this event.'
    }, {
        x: 1526774400000,
        name: 'Event name',
        label: 'Another event label',
        description: 'Description of second event'
    }]

_The demo below illustrates a timeline of space exploration. The demo shows even intervals_

<iframe width="100%" height="470" style="null" src=https://www.highcharts.com/samples/embed/highcharts/series-timeline/connector-styles allow="fullscreen"></iframe>

The demo below also illustrates the key moments of space exploration, but it’s extended by further events, and it shows real-time dates distributed along a `datetime` axis.

<iframe width="100%" height="470" style="null" src=https://www.highcharts.com/samples/embed/highcharts/series-timeline/datetime-axis allow="fullscreen"></iframe>

Vertical timeline
-----------------

To display a vertical timeline, set `chart.inverted` to `true`.

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-timeline/inverted allow="fullscreen"></iframe>

Alternate labels
----------------

Use the `alternate` property in the `dataLabels` configuration, for placing the data labels alternately (on both sides of the point).

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-timeline/alternate-labels allow="fullscreen"></iframe>

Other configuring options
-------------------------

Customize a timeline chart with options that are standard to most Highcharts charts, such as data labels `width`, `distance` or using the point properties, `color`, `x`, `markers` or the connectors. In the demo below the color properties of the `marker` data point property is setting the color of a section in the timeline.

The demo below illustrates styling of different elements in the timeline series chart.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/blog/timeline allow="fullscreen"></iframe>
