Introduction
===

A column pyramid chart, like the column chart, is often used to visualize comparisons of data sets with discrete data, where the focus is on the values instead of categories as people read from left to right. This demo visualizes comparisons of the height of five pyramids.

Adapt the x axis to the right if the audience read from right to left, for instance, an audience from the middle east.

Here is a demo using a column pyramid series to display one pyramid per value along an X axis.

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/column-pyramid allow="fullscreen"></iframe>

Other demos:
------------

**Stacked column pyramid**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/columnpyramid-stacked allow="fullscreen"></iframe>

**Inverted column pyramid**

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/columnpyramid-inverted allow="fullscreen"></iframe>

Installation
------------

Requires `highcharts-more.js`.

To display horizontal pyramids, set `chart.inverted` to `true`.

Configuration
-------------

The code of `columnpyramid` is very simple to set, like the bar chart, as many features are already set by default such as the responsiveness, tooltip, colors, legends, etc.

Use Cases

    
    {
            chart: {
                type: 'columnpyramid'
            },
            series: [{
                data: [138.8, 136.4, 104, 101.1, 75]
            }]
        }

API Docs
--------

Check the following [API document link](https://api.highcharts.com/highcharts/plotOptions.columnpyramid) to learn more about the column pyramid.