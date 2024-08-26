DataGrid
===

The DataGrid is a versatile tool registered together with the Highcharts Dashboards package for visualizing and editing tabular data. It can be a part of a dashboard or used as a standalone component, but requires a Dashboards license. By incorporating this component, users can effectively interact with data in a structured and editable table format.

## Installation
The package can be imported through a script tag from the Highcharts CDN like this:

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
```

Or it can be installed through NPM like this:

```bash
npm install @highcharts/dashboards
```

Then import the module as follows:

```ts
import * as DataGrid from '@highcharts/dashboards/datagrid';
```

## Usage
The DataGrid can be added as a standalone component or as a part of a Dashboard.
The following example demonstrates how to use the DataGrid as a standalone component.

First you need to create a container for the DataGrid:

```js
<div id="container"></div>
```

Then you can create the DataGrid instance and add it to the container.
Note that the DataGrid requires data to be in the form of a data table or a data table options object.
Check [the data documentation](https://www.highcharts.com/docs/dashboards/data-handling) to read more about data handling.

Data Table Options:
```js
import DataGrid from '@highcharts/dashboards/datagrid';
DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            price: [1.5, 2.53, 5, 4.5],
        }
    }
});
```

Data Table Instance:
```ts
import DataGrid from '@highcharts/dashboards/datagrid';
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            price: [1.5, 2.53, 5, 4.5],
        }
    })
});
```

## Styles
The DataGrid component requires the following styles to be imported in your main CSS file:

```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```


## Options
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/data-grid/basic/overview" allow="fullscreen"></iframe>

The DataGrid has a number of options that can be used to customize the appearance and behavior of the table.

For example, using the [`editable`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#editable) option you can make all the cells in a DataGrid editable (`true`) or read-only (`false`):

Using [`columns`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#columns), you can format data and headers in cells, for example by adding units to them. The key is the column name and the value is the object with the column-specific options.

```js
DataGrid.dataGrid('container', {
    dataTable: { columns },
    settings: {
        caption: {
            text: 'Fruit market'
        },
    },
    columns: [{
        id: 'product',
        cellFormat: '{value} No. 1',
        headerFormat: '{id} name'
    }, {
        id: 'weight',
        cellFormat: '{value} kg',
        headerFormat: '{id} (kg)'
    }, {
        id: 'price',
        cellFormat: '{value} $',
        headerFormat: '($) {id}'
    }, {
        id: 'metaData',
        enabled: false
    }]
});
```

A complete list of the API options can be found [here](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.DataGridOptions-1.html).

[Go to the next article](https://www.highcharts.com/docs/datagrid/understanding-datagrid) to read more about the DataGrid structure.
