Data Layer
==========

The data layer provides functionality to load, process and convert data for
different use cases. Additionally it provides the necessary structure to
synchronize data changes between different components and network nodes.



DataTable - Managing Data
-------------------------

Tables are the central point in managing data. Data in tables is organized by
columns. This means that retrieving a column from a table comes at nearly no
cost.



### Creating A Table

A table can be created with predefined columns and a manual ID to differenciate
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
table. If a change in the table is done via column reference, no event will be
emitted.

```TypeScript
table.on('afterSetRows', function (e) {
    e.rowCount === 1;
    this.getRowCount() === 3;
});
table.setRow([2023, 'Gremlins 3']);
```



Loading Data
------------

Loading external data is usually done via a DataStore. A DataStore takes either
an URL or an local source.