Working with data
=================

In Highcharts core, you specify the data through the [series.data](https://api.highcharts.com/highcharts/series.line.data) option directly on the configuration object. However, this is not always the simplest way to add data, for example if you are loading data from a CSV file, a HTML table or a Google Spreadsheet.

## DataTables: A more structured approach

Highcharts since v13 offers the [`dataTable`](https://api.highcharts.com/highcharts/series.line.dataTable) and [`dataMapping`](https://api.highcharts.com/highcharts/series.line.dataMapping) options as a structured way to work with tabular data. This approach is particularly useful when:

- Loading data from **structured sources** like databases, CSV files, or APIs
- Displaying **multiple series from the same source** with different column mappings
- **Sharing data between Grid and Chart components** for synchronized visualizations
- Implementing **reactive data updates** without manual point management
- Building **dashboards with multiple synchronized components**

For a comprehensive guide, see [Using DataTables with Series](https://highcharts.com/docs/working-with-data/using-datatables-in-series).

## Data module and custom preprocessing

In most of these cases you can use our built-in data parsing features from the _Data module_. Alternatively, if you don't have control over the data structure, you may need to preprocess the data by setting up your own _data parser_.

We will cover the following topics:

*   [Using DataTables with Series](https://highcharts.com/docs/working-with-data/using-datatables-in-series)
*   [Data compression](https://highcharts.com/docs/working-with-data/data-compression)
*   [Using the Data module](https://highcharts.com/docs/working-with-data/data-module)
*   [Custom preprocesssing](https://highcharts.com/docs/working-with-data/custom-preprocessing)
*   [Live data](https://highcharts.com/docs/working-with-data/live-data)
*   [Data from a database](https://highcharts.com/docs/working-with-data/data-from-a-database)
*   [Getting data across domains (JSONP)](https://highcharts.com/docs/working-with-data/getting-data-across-domains-jsonp)