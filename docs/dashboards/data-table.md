# Data Table

A data table (class `DataTable`) is a structured representation of data consisting of columns and rows.
It offers methods for adding, removing, and manipulating columns and rows and for accessing data from specific cells.  
Think of a Data Table as a grid where each row represents a record or entry, and each column represents a specific attribute or piece of information.

`DataTable` is an integral part of the **Dashboards** and the **Grid** bundles. Hence it can be accessed from both so there is no need to load any additional modules.

## Creating a data table
There are several ways to create a `DataTable`:

### 1. From a data pool
The `DataPool` is the main entry point for data handling in **Highcharts Dashboards**. It handles incoming data and creates a `DataTable` to store the imported data.

It can be created automatically when you create a **Dashboard**:
```javascript
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'my-connector',
            csvURL: 'https://example.com/data.csv'
        }]
        ...
```

Or you can create it manually with connector options:

```javascript
const dataPool = new DataPool();

dataPool.setConnectorOptions({
    type: 'CSV',
    id: 'my-connector',
    csvURL: 'https://example.com/data.csv'
});

const dataTable = await dataPool
    .getConnector('my-connector')
    .then((connector) => connector.getTable());
```

### 2. From a data connector
A `DataConnector` is a service that retrieves data from an external source and creates a `DataTable` to store the imported data.

The `DataTable` is accessible via the `DataConnector.getTable()` method.

```javascript
async function loadData() {
    const connector = new DataConnector.types.CSV({
        csvURL: 'https://example.com/data.csv'
    });

    await connector.load();

    const dataTable = connector.getTable();
}
```

### 3. Manually
You can create a DataTable manually by providing the columns and rows.

```javascript
const dataTable = new Dashboards.DataTable({
    columns: {
        x: [1, 2, 3, 4, 5, 6],
        y: ['a', 'a', 'b', 'b', 'c', 'c']
    }
});
```

### 4. From a data modifier
A `DataModifier` is a service that modifies data in a `DataTable`. It can create a new `DataTable` with the modified data.

```javascript
const sortModifier = new DataModifier.types.Sort({
    direction: 'asc',
    orderByColumn: 'City'
});

const table = new Dashboards.DataTable({
    columns: {
        Rank: [1, 2, 3, 4, 5, 6],
        City: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
        State: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
        Population: [5259764, 4976157, 2568927, 2192229, 1402393, 453558]
    }
});

const tableModified = sortModifier.modifyTable(table.clone());
```

## Multiple data tables
Defining multiple `DataTables` allows you to parse or format data from the same 
data source in different ways without having to define a separate connector for
each adjustment.

Each `DataTable` should have a `key` property that will be referenced in the
component.

Also, you can define connector options (`columnIds`, `firstRowAsNames`,
`orientation`, `beforeParse`) and use the `DataModifier` service.

```javascript
dataPool: {
    connectors: [{
        id: 'data-connector',
        type: 'JSON',
        data: {
            employees: [
                ['Name', 'Age', 'Salary'],
                ['John', 30, 50000],
                ['Jane', 25, 45000],
                ['Bob', 35, 60000],
                ['Alice', 28, 52000]
            ],
            metrics: {
                revenue: 100000,
                costs: 75000
            }
        },
        dataTables: [{
            key: 'employees',
            beforeParse: function({ employees }) {
                return employees;
            }
        }, {
            key: 'metrics',
            firstRowAsNames: false,
            columnIds: ['revenue', 'costs'],
            beforeParse: function({ metrics }) {
                return [[metrics.revenue, metrics.costs]];
            },
            dataModifier: {
                type: 'Math',
                columnFormulas: [{
                    column: 'profit',
                    formula: 'A1-B1'
                }]
            }
        }]
    }]
}
```

To use a specific `DataTable` in a component, define the [dataTableKey](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_ConnectorHandler.ConnectorHandler.ConnectorOptions#dataTableKey) property to indicate the
corresponding `key` in the component's connector options:

```javascript
components: [{
    renderTo: 'dashboard-col-0',
    type: 'Grid',
    connector: [{
        id: 'data-connector',
        dataTableKey: 'employees'
    }]
}, {
    renderTo: 'dashboard-col-1',
    type: 'Grid',
    connector: [{
        id: 'data-connector',
        dataTableKey: 'metrics'
    }]
}]
```

## Get operations
The `DataTable` class offers several methods for accessing data. Some of the most common are:

- `getRow`- Returns a row with the specified index from the data table.
- `getRows`- Returns all or several rows.
- `getRowIndexBy`- Returns the index of the first row that matches the specified condition.
- `getColumn`- Returns a column with the specified name or alias from the data table.
- `getColumns`- Returns all or several columns.
- `getModifier`- Returns the modifier for the table.

And many more. For a full list of methods, see the [API documentation](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable).


## Set operations
The `DataTable` class offers several methods for modifying data. Some of the most common are:

- `setRow`- Sets cell values of a row.
- `setRows`- Sets cell values of multiple rows.
- `setColumn`- Sets cell values for a column.
- `setColumns`- Sets cell values for multiple columns.
- `setModifier`- Sets or unsets the modifier for the table.

See other available methods in the [API documentation](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable).

## Other operations
Other useful operations include:

- `clone`- Returns a clone of the table.
- `deleteColumns`- Deletes columns from the table.
- `deleteRows`- Deletes rows from the table.
- `on`- Adds an event listener to the table for a specific event.
