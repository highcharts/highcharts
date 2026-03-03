---
tags: ["grid-pro"]
sidebar_label: "Exporting data"
---
# Exporting data from Highcharts Grid

Highcharts Grid Pro supports exporting the grid data to CSV and JSON formats.

The `grid.exporting` API on a grid instance provides methods for exporting data:

* `grid.exporting.downloadCSV()`: Downloads the CSV string as a file.
* `grid.exporting.getCSV()`: Returns the CSV string.
* `grid.exporting.downloadJSON()`: Downloads the JSON string as a file.
* `grid.exporting.getJSON()`: Returns the JSON string.

## Basic usage

```js
const grid = Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                product: ['Apple', 'Pear', 'Plum'],
                price: [1.5, 2.53, 5]
            }
        }
    }
});

// Download files:
grid.exporting.downloadCSV();
grid.exporting.downloadJSON();
```

## Get export data as strings

```js
const csv = grid.exporting.getCSV();
const json = grid.exporting.getJSON();

console.log(csv);
console.log(json);
```

See the [API reference](https://api.highcharts.com/grid/#classes/Grid_Core_Grid.Grid#exporting) for more information on the `Grid.exporting` options.

Try it - [the exporting sample.](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/exporting/)
