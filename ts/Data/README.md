Data Layer
==========

The data layer provides functionality to load, process and convert data for
different use cases. Additionally it provides the necessary structure to
synchronize data changes between different components and network nodes.

Sub-folders:

* Converters - create a table from an input format, and an output format from a
  table

* Modifiers - modify table data into a second table, accessible via the
  `DataTable.modified` property.

* Stores - make data sources accessible via a managed table



DataTable - Managing Data
-------------------------

Tables are the central point in managing data. Data in tables is organized by
columns. This means that retrieving a column from a table comes at nearly no
cost.



### Creating A Table

A table can be created with predefined columns and a manual ID to differentiate
between table instances.

```TypeScript
const table = new DataTable(
    {
        year: [1984, 1990],
        title: ['Gremlins', 'Gremlins 2: The New Batch']
    },
    'gremlins_movies'
);
table.id === 'gremlins_movies';
table.autoId === false;
```



### Column Aliases

Tables provide an alias system that allows access to columns under multiple
names. That way also row objects can have different key-value-pairs but
identical data.

```TypeScript
table.setColumnAlias('movie_title', 'title');
table.getColumn('movie_title')[0] === table.getColumn('title')[0];
table.deleteColumnAlias('movie_title');
table.getColumn('movie_title') === undefined;
```



### Column References

For maximum performance you can retrieve columns from the table as reference.
These arrays are the internal representation and a change in the retrieved array
will change the table's column as well.

```TypeScript
const column = table.getColumn('year', true);
column[0] = 2004;
table.getRow(0)[0] === 2004;
table.setCell('year', 0, 1984);
column[0] === 1984
```



### Change Events

Changing data in the table with setter functions will trigger an event on the
table. If a change in the table is done indirectly via column reference, no
event will be emitted.

```TypeScript
table.on('afterSetRows', function (e) {
    e.rowCount === 1;
    this.getRowCount() === 3;
});
table.setRow([2023, 'Gremlins 3']);
table.deleteRows(table.getRowIndexBy('title', 'Gremlins 3'), 1);
```



### Table Modifier

Tables can provide automatic modification of data during their lifetime with the
help of modifiers. Each table can have only one modifier, but this modifier
might call additional modifiers.

Modifications usually do not change the table. Instead modifiers produce a
second table, accessible under `DataTable.modified`. Changes in the original
table will also result in changes in the second table, unless the modifier
explicitly dismiss incoming changes.

```TypeScript
table.setModifier(new RangeModifier({
    ranges: [{
        column: 'year',
        minValue: 1980,
        maxValue: 1989,
    }],
    strict: true
});
table.getRowCount() === 2;
table.modified.getRowCount() === 1;

table.setRows([
    [1983, 'Gremlins Teaser'],
    [2023, 'Gremlins 3']
]);
table.getRowCount() === 4;
table.modified.getRowCount() === 2;
```



### DataTable in Highcharts

If the series does support tables, you can use the 'setTable' to connect and
synchronize table and series. Otherwise you use the data options to provide the
columns of interest. The most effective way is to retrieve the necessary data
from the table as two dimensional arrays like Highcharts expects it.

```TypeScript
const chart = new Highcharts.chart('container', {
    series: [{
        type: 'flags',
        data: table.getRows(0, void 0, ['year', 'title']);
    }]
});
```

In case of a series that only accepts data points as objects, you might need to
setup column aliases to retrieve the expected structure.

```TypeScript
table.setColumnAlias('name', 'year');
table.setColumnAlias('label', 'title');
const chart = new Highcharts.chart('container', {
    series: [{
        type: 'timeline',
        data: table.getRowObjects(0, void 0, ['name', 'label']);
    }]
});
```



### DataTable in DataGrid

DataGrid shows and optionally modifies cell content in a table. DataGrid can
also change the order of cells, but DataTable provides only limited information
about the original order of a source. Therefor a DataStore might be needed in
addition to retrieve the original order.

```TypeScript
const dataGrid = new DataGrid('container', {
    dataTable: new DataTable({
        Value: [ 12.34, 45.67, 78.90 ],
        Currency: [ 'EUR', 'DKK', 'NOK' ]
    }
});
```

If a row reference is needed, this index column has to be part of the table.

```TypeScript
const dataGrid = new DataGrid('container', {
    dataTable: new DataTable({
        '': [1, 2, 3],
        Value: [ 12.34, 45.67, 78.90 ],
        Currency: [ 'EUR', 'DKK', 'NOK' ]
    }
});
dataGrid.table.getRow(dataGrid.table.getRowIndexBy('', 2));
```



### DataTable in Dashboards

Some components in Dashboard use DataTable or DataStore to show data. You can
use a single table or store in multiple components and in that way synchronize
data.



DataStore - Loading And Saving Data
-----------------------------------

Loading external data is usually done via a DataStore. A DataStore takes either
an URL or a local source.



### DataStore Registry

DataStore types can be directly loaded via import. In case of bundles stores can
also accessed via registry, as the registry gets updated with each bundled type.

```TypeScript
import CSVStore from 'dashboards/Data/Stores/CSVStore';
```

```TypeScript
const CSVStore = Dashboard.DataStore.registry.CSVStore;
```



### Data Converter

Every store needs a specific converter to parse data from and to the source
format. You can provide your own custom converter or keep the default one.

```TypeScript
const converter = new CSVConverter({
    decimalPoint: ',',
    itemDelimiter: ';',
});
const store = new CSVStore({
    csv: 'a;b\n1,2;3,4\n5,6;7,8'
});
await store.load();
store.table.getRowCount() === 2;
```



### Creating A Store And Loading Data

You can create a store without loading any data. In that case you just get
an empty table, which you can fill up with data to save it later. Or you can
provide a table with existing data.

```TypeScript
const store = new CSVStore();
store.table.getRowCount() === 0;
const table = new DataTable({ column: [1, 2, 3] });
const store2 = new CSVStore(table);
store.table.getRowCount() === 3;
```

Depending on the store type you have to provide different mandatory options
to load data. Continue with our example we can provide an URL to a CSV and then
wait for loading to fulfill.

```TypeScript
const store = new CSVStore(void 0, {
    csvURL: 'https://domain.example/source.csv'
});
try {
    await store.load();
}
catch (error) {
    console.error(error);
}
store.table.getRowCount() > 0;
```



### Saving Data

How to save a table depends on the store type and use case. In a strict
server-less situation, instead of the save function you usually use the
related converter.

```TypeScript
const store = new CSVStore(void 0, {
    csv: 'column\n1\n2\n3\n'
});
store.converter.export(store) === 'column\n1\n2\n3\n';
```

If your store is based on a external source in the internet or in the HTML, the
save function can write data back. Please note that an error will be thrown, if
this is not supported by the store type, or if permissions do now allow this.

```TypeScript
const store = new HTMLTableStore(void 0, {
    tableElement: document.getElementById('the_table')
});
try {
    await store.save();
}
catch (error) {
    console.error(error);
}
```



DataOnDemand
------------

With DataOnDemand one can "lazy" load stores besides the initial phase. After
adding store name, store type and store options to DataOnDemand, one can request
(later on) the store or table under their given name and the class will give a
promise with the store or table as soon as it has been loaded.

```TypeScript
const onDemand = new DataOnDemand([{
    name: 'My Google Spreadsheet',
    storeType: 'GoogleSheetsStore',
    storeOptions: {
        googleAPIKey: 'XXXXX',
        googleSpreadsheetKey: 'XXXXX',
    }
}]);
onDemand.setStoreOptions({
    name: 'My CSV',
    storeType: 'CSVStore',
    storeOptions: {
        csvURL: 'https://domain.example/data.csv'
    }
});
const googleStore = await onDemand.getStore('My Google Spreadsheet');
const csvTable = await onDemand.getStoreTable('My CSV');
```

DataOnDemand is one of possible way to coordinate and share stores and their
data between multiple modules. You can request the store multiple times, while
the class will load each store only ones.

```TypeScript
const googleStore1 = await onDemand.getStore('My Google Spreadsheet');
const googleStore2 = await onDemand.getStore('My Google Spreadsheet');
const googleStore3 = await onDemand.getStore('My Google Spreadsheet');
```
