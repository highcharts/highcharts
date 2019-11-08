Data module
===

The Data module provides options for loading data from external sources, like CSV files, HTML tables or Google Spreadsheets, in a convenient way, using a declarative options set. Its options are available under the data object. For the full reference and samples, see [api.highcharts.com/highcharts/data](https://api.highcharts.com/highcharts/data).

TABULAR STRUCTURE
-----------------

The sources for the data module (CSV file, HTML tables or Google spreadsheets), all share the tabular structure. When parsed by the data module, they are internally read into a virtual table of rows and columns. This basic model allows for a set of options that is shared between the sources. The region of the table is defined by the _startRow_, _endRow_, _startColumn_ and _endColumn_ options. The source data can be rotated or inverted by setting the _switchColumnsAndRows_ option. And for all sources, the _seriesMapping_ object allows custom assignment of the columns to specific point options.

LOADING CSV
-----------

CSV can be loaded in two ways. Either [data.csv](https://api.highcharts.com/highcharts/data.csv), that holds a CSV string to be read into the chart, or, since v6.1, [data.csvURL](https://api.highcharts.com/highcharts/data.csvURL) that points to a file location. By default, the first row of the CSV data is interpreted as series names, the first column signifies category names or X values/dates, and subsequent columns hold data values.

Here's how to load the data using data.csvURL and apply the csv inside a common options structure. The sample can be seen live at [data-module.csv.htm](https://highcharts.com/studies/data-module-csv.htm).

1. **Contents of the CSV file**

```
    Categories,Apples,Pears,Oranges,Bananas
    John,8,4,6,5
    Jane,3,4,2,3
    Joe,86,76,79,77
    Janet,3,16,13,15
```

2. **The chart initialization**

```js
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    data: {
        // enablePolling: true,
        csvURL: window.location.origin + '/studies/data.csv'
    },
    title: {
        text: 'Fruit Consumption'
    },
    yAxis: {
        title: {
            text: 'Units'
        }
    }
});
```

Additional options relevant to CSV parsing are [itemDelimiter](https://api.highcharts.com/highcharts/data.itemDelimiter) and [lineDelimiter](https://api.highcharts.com/highcharts/data.lineDelimiter).

If the data is dynamic and the chart should be kept updated, set [enablePolling](https://api.highcharts.com/highcharts/data.enablePolling) to true, and optionally change the [dataRefreshRate](https://api.highcharts.com/highcharts/data.dataRefreshRate).

Loading data from a table
-------------------------

In some cases it could be useful to load the chart data from a table, rather than generating the table from the chart data. In this case, all you need to do is make the [data.table](https://api.highcharts.com/highcharts/data.table) option point to the id of the table:

```js
Highcharts.chart('container', {
    data: {
        table: 'datatable'
    },
    title: {
        text: 'Data extracted from a HTML table in the page'
    }
});
```

View a live sample of [data fetched from a table](https://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/column-parsed/).

Loading from Google Spreadsheets
--------------------------------

Loading the chart data from Google Spreadsheets is a good idea if you want to set up a chart based on data that other team members should be allow to edit and keep updated. See the [API docs](https://api.highcharts.com/highcharts/data.googleSpreadsheetKey) for explanation and sample.
