---
tags: ["grid-pro"]
---

# Sparkline

Note: Customizing cell content is not part of Highcharts Grid Lite, so refer to [install instructions](https://www.highcharts.com/docs/dashboards/grid-standalone) for the full version to enable this functionality.

A sparkline component renders an inline miniature chart (e.g. bar, line) directly within cells in tables. 

The Sparkline component is powered by Highcharts, using all its chart features. It requires [Highcharts](https://www.highcharts.com/products/highcharts/) and a valid **Highcharts Core license**.

## Setup
If you’re simply including the `highcharts.js` file, just make sure to load it before `grid-pro.js`. If you’re using ES Modules or importing the bundles in the opposite order, you’ll also need to manually register Highcharts by calling `SparklineRenderer.useHighcharts(Highcharts)` or `Grid.ColumnRendererRegistry.types.sparkline.useHighcharts(Highcharts)`.


## Defaults
Unlike traditional charts, sparkline are typically rendered without axes, coordinates, or labels, making them ideal for summarizing trends in a small space.

```js
{
  chart: {
    height: 40,
    animation: false,
    margin: [5, 8, 5, 8],
    backgroundColor: 'transparent',
    skipClone: true
  },
  accessibility: {
    enabled: false
  },
  tooltip: {
    enabled: false
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  },
  xAxis: {
    visible: false
  },
  yAxis: {
    visible: false
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      borderWidth: 0,
      marker: {
        enabled: false
      },
      states: {
        hover: {
          enabled: false
        },
        inactive: {
          enabled: false
        }
      },
      animation: false,
      dataLabels: {
        enabled: false
      }
    },
    pie: {
      slicedOffset: 0,
      borderRadius: 0
    }
  }
}
```

## Configuration
You can configure embedded charts by the `chartOptions` API option, that supports all Highcharts options.

```js
{
  id: 'trend', // column id
  cells: {
    renderer: {
      type: 'sparkline',
      chartOptions: {
        chart: {
          type: 'bar'
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true
            }
          }
        }
      }
    }
  }
}
```

## Performance
Sparkline supports all standard Highcharts chart options and is optimized for speed, including virtual scrolling for large datasets.

## View the Result
With the configuration above, your Grid should look like this:

<iframe src="https://www.highcharts.com/samples/embed/grid-pro/demo/sparkline" allow="fullscreen"></iframe>
