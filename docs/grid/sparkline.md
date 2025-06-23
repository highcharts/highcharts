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

### Data modifiers
Data modifiers allow manipulation of data provided to connectors to be placed in a modified version, e.g. in the **Grid Pro**.

There are different types of data modifiers:
* `Chain` - A chain of modifiers executed in a fixed order.
* `Invert` - The invert modifier reverses the order of displayed rows.
* `Range` - Range modifiers allow selecting rows to be displayed based on specific ranges regarding data from specific columns.
* `Sort` - Sort modifiers allow the display order of rows to be set based on the result of sorting the data in specific columns.
* `Math` - Math modifiers allow the creation of additional columns with data mathematically transformed from another column.

1. Init the dataTable with data.
```js
const data = new Highcharts.DataTable({
  columns: dataSource
});
```

2. Define the formula.
```js
// Define modifier / formula calculation
const mathModifier = new Highcharts.DataModifier.types.Math({
  columnFormulas: [{
    column: 'Sum',
    formula: 'C1+D1'
  }]
});
```

3. Add modifier result to dataTable.
```js
// Add modified data to initial data source
await data.setModifier(mathModifier);
```

4. Init Grid
```js
Grid.grid('container', {
  dataTable: data,
  ... // other Grid Options
});
```

In this example, a column named `Sum` is created with data that is the sum of the numbers in the previous columns in the row.

Note that you also need to import modules to use the appropriate modifiers. For example:
```html
<script src="https://code.highcharts.com/modules/data-tools.js"></script>
```

You can read more in the [MathModifier Article](https://www.highcharts.com/docs/dashboards/mathmodifier-module).

## Performance
Sparkline supports all standard Highcharts chart options and is optimized for speed, including virtual scrolling for large datasets.

## View the Result
