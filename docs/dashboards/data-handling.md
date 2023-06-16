Data Handling
=============

Highcharts Dashboards has a separate set of classes to handle data.  The
following classes are used by the Board class to provide its components with
data to show.



## DataPool

With the `BoardOptions.dataPool` option you can define as many connections to
data sources as you like.  Each definition is accessible by its `id` and will
only create a connector to load the actually data when accessed the first time
via `Board.dataPool.getConnector`.



## DataConnector

Each DataConnector loads data from a source and sometimes also saves data
changes.  All connectors manage the data in a DataTable which is accessible via
`DataConnector.table` property.  Some connectors support source polling to
update the DataTable with new data from the source.



## DataTable

A DataTable can be created from DataConnectors, DataModifiers, or other
DataTables.  Each DataTable can contain columns, column aliases, and rows.  In
addition DataTable also emit events, when changes on the table happen.  Changes
can be directly done on the table or with DataModifiers.



## DataModifier

DataTables can provide automatic modification of data during their lifetime with
the help of modifiers.  Each table can have only one modifier, but this modifier
might call additional modifiers.  If a DataModifier changes the DataTable,
changes are available on a clone in the `DataTable.modified` property.



## DataCursor

The DataCursor provides a system to synchronize status data on cells of
DataTables.  This can be for example highlights, markers, or selections.  It
supports multiple tables and statuses simultaneously.  Each Board has a DataCursor
that is accessible via the `Board.dataCursor` property.
