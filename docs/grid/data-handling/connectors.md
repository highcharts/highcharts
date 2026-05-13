---
sidebar_label: "Connectors"
---

# Connectors

Grid can use `DataConnector` types to load external data into a
local [`DataTable`](https://www.highcharts.com/docs/grid/data-handling/clientside#datatable). After that initial load, Grid works with the data through the
local provider model.

In other words, connectors are for loading and preparing data, not for
server-side sorting, filtering, or pagination. For example, a JSON or CSV file loaded from
your server is fetched first, then Grid handles filtering, sorting, and
pagination client-side on the loaded data.

## Supported connector types

The Grid bundles import these connector types:

| Connector | `type` |
|-----------|--------|
| CSV | `'CSV'` |
| JSON | `'JSON'` |
| Google Sheets | `'GoogleSheets'` |
| HTML table | `'HTMLTable'` |

These connectors are available in both Grid Lite and Grid Pro.

## Basic example

```js
Grid.grid('container', {
    data: {
        // Connectors load data into a local `DataTable`.
        connector: {
            type: 'JSON',
            dataUrl: '/api/products.json'
        },
        // Optional: refresh rows when the connector updates the table.
        updateOnChange: true
    },
    pagination: {
        enabled: true
    }
});
```

This example fetches data through a JSON connector, but pagination still runs
client-side after the data has been loaded.

## When to use connectors

Use connectors when:

- your data already comes from CSV, JSON, Google Sheets, or an HTML table
- you want to reuse Dashboards data-loading infrastructure
- you want the connector to populate a `DataTable` for local Grid interaction

Use [Server-side data handling](https://www.highcharts.com/docs/grid/data-handling/serverside) instead when your backend should handle sorting, filtering, and pagination on demand.

For full connector details and connector-specific options, read the Dashboards
documentation on [Data handling / DataConnector](https://www.highcharts.com/docs/dashboards/data-handling#dataconnector).

## API reference

- [`data`](https://api.highcharts.com/grid/data)
- [`data.local.connector`](https://api.highcharts.com/grid/data.local.connector)
