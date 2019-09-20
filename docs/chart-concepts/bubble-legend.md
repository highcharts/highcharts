Bubble legend
===

## Introduction

A bubble legend is an additional element, which can be added in any position in the chart legend. The bubble legend allows to present the scale of the bubble series in a simple and transparent way.

**Demo with autoranges**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/bubble-legend/autoranges allow="fullscreen"></iframe>

**Demo with similarto series**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/bubble-legend/similartoseries allow="fullscreen"></iframe>

**Demo with ranges**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/bubble-legend/ranges allow="fullscreen"></iframe>

Installation
------------

Requires `highcharts-more.js`. To display bubble legend, set `legend.bubbleLegend.enabled` to `true`.

Configuration
-------------

The code of `bubbleLegend` is very simple to set, and it allows a lot of customization. The part of the options like [minSize,](https://api.highcharts.com/highcharts/legend.bubbleLegend.minSize) [maxSize, ](https://api.highcharts.com/highcharts/legend.bubbleLegend.maxSize)[sizeBy](https://api.highcharts.com/highcharts/legend.bubbleLegend.sizeBy), and the size calculation method works in the same way as in a [bubble series.](https://api.highcharts.com/highcharts/plotOptions.bubble)

Default style settings are taken from the first visible bubble series. The position of the bubble legend element on the chart is defined by the legend position.

Use Cases
---------

There are two ways to add the bubble legend to the chart:

**1. Automatic**: without defining ranges. Creates three bubbles in the legend, the smallest and the biggest have the same dimensions and value as their counterparts in bubble series (all bubble series are included). The middle bubble has an average value of the other two. If there is only one bubble point on the chart, the bubble legend will also have only one bubble.

    
    {
        chart: {
            type: 'bubble'
        },
        legend: {
            bubbleLegend: {
                enabled: true
            }
        },
        series: [{
            data: [
                [9, 81, 63],
    	[98, 5, 89],
    	[51, 50, 73],
    	[41, 22, 14],
    	[58, 24, 20]
            ]
        }]
    }

**2. Custom**: with manually defined ranges. Bubbles are calculated based on `ranges`, `minSize`, and `maxSize`, bubble series dimensions are not included.

    
    {
        chart: {
            type: 'bubble'
        },
        legend: {
            bubbleLegend: {
                enabled: true,
                minSize: 20,
                maxSize: 60,
                ranges: [{
                    value: 14
                }, {
                    value: 89
                }]
            }
        },
        series: [{
            minSize: 20,
            maxSize: 60,
            data: [
                [9, 81, 63],
    	[98, 5, 89],
    	[51, 50, 73],
    	[41, 22, 14],
    	[58, 24, 20]
            ]
        }]
    }

API document
------------

For more details check the [API document link.](https://api.highcharts.com/highcharts/legend.bubbleLegend)