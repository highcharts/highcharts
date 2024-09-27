Data Pool & Connectors
======================

The data pool provides the central access to data and data management in a
dashboard. It manages connectors and their tables in a on-demand-manner, so
that data is only loaded when actually requested by a dashboard component.

Data connectors manage the transaction and preparation of data. Loading data
from a source is an asynchronous process as the source is usually a web server.



DataPool
--------

Each dashboard has one `DataPool` instance for all components. It is available
via the `Board.dataPool` class property and can be configured with the
`BoardOptions.dataPool` option. Usually one or more connectors get defined,
containing and ID, the data source, and whether the data needs some form of
additional modification. The ID is used to retrieve a connector, which is an
asynchronous process.

### DataPool Example

``` JavaScript
async function run() {
  const board = await Dashboards.board('container', {
    // ...
    dataPool: {
      connectors: [{
        type: 'JSON',
        id: 'My Series Data',
        enablePolling: true,
        jsonURL: 'https://'
      }, {
        type: 'CSV',
        id: 'My Currency Data',
        csvURL: 'https://'
        dataModifier: {
            type: 'Math',
            columnFormulas: [{
                column: 'My Fixed Rate',
                formula: 'A1*7.8'
            }]
        }
      }]
    }
    // ...
  }, true);
  // Access to the data pool is usually performed by a component.
  const table = await board.dataPool.getConnectorTable('My Currency Data');
  const modifiedTable = table.modified;
}
run();
```



DataConnector
-------------

The `DataConnector` is the base class for all connectors and can not be used by
its own to load or save data. It includes common functionality like events,
server polling, and the management of meta information like the column order.

Additionally the `DataConnector` also contains the registry of all available
connectors. You can access the registry via `DataConnector.types`.



CSVConnector
------------

The `CSVConnector` allows the loading of structured text data, where each table
cell is separated by comma or semicolon, while each row is separated by a line
break. You can provided data via an URL or directly with a CSV string. Details
of all available options can be found in the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_CSVConnectorOptions.CSVConnectorOptions-1).

### CSVConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.CSV({
        csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv'
    });
    await connector.load();
}
run();
```



GoogleSheetsConnector
---------------------

With the `GoogleSheetsConnector` is it possible to load table data from a Google
Docs spreadsheet. The connector needs the API key related to a Google account
and the document ID itself. See the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_GoogleSheetsConnectorOptions.GoogleSheetsConnectorOptions-1)
for all options.

Please note that the Google account needs read access to the document. Usually
the Google account should not be the owner of the document as this decreases the
possibilities of limiting access.

### GoogleSheetsConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.GoogleSheets({
        googleAPIKey: 'AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe',
        googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
    });
    await connector.load();
}
run();
```



HTMLTableConnector
------------------

The `HTMLTableConnector` allows the import and export of an HTML table as a
`DataTable`. It is the only connector, that does not support loading from a
remote source. Instead one provides an element reference from the current web
page. Details are listed in the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_HTMLTableConnectorOptions.HTMLTableConnectorOptions-1).

### HTMLTableConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.HTMLTable({
        dataTable: document.querySelector('#table');
    });
    await connector.load();
}
run();
```



JSONConnector
-------------

The `JSONConnector` supports loading data in a row-oriented structure as found
in Highcharts series types. The connector options can also control how columns
and rows are structured in the JSON array to support other structures. See the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_JSONConnectorOptions.JSONConnectorOptions-1)
for all possible combinations.

### JSONConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.JSON({
        data: [
            ['row 1', 1, 2, 3],
            ['row 2', 2, 3, 4],
            ['row 3', 0, 1, 2]
        ]
    });
    await connector.load();
}
run();
```



Custom Data Connectors
----------------------

It is possible to create additional DataConnectors based on the `DataConnector`
base class. An implementation has usually three steps to fulfill:

1. Load the data from the source and react to possible transaction errors.

2. Create a `DataTable` and add the data to it.

3. Make the table available and in case of related options update the table with
   incoming changes from the source.

You can see a typical implementation of this in the
[GoogleSheetsConnector](https://github.com/highcharts/highcharts/blob/master/ts/Data/Connectors/GoogleSheetsConnector.ts).
Please note that the included connectors use a separate converter instance for
the second step regarding adding the data to the `DataTable`.
