---
sidebar_label: "Overview"
---

# Data handling

Highcharts Grid always reads and writes data through the root `data` option. The
configured data source determines whether sorting, filtering, and pagination run
in memory or on the server.

## Data models at a glance

| Model | Configure with | Query handling | Availability |
|-------|----------------|----------------|--------------|
| Local / client-side | `data.columns`, `data.dataTable`, or `data.connector` | Sorting, filtering, and pagination run in memory after data is loaded into a `DataTable`. | Grid Lite and Grid Pro |
| Remote / server-side | `data.providerType: 'remote'` | Sorting, filtering, and pagination are sent to the backend and rows are fetched on demand. | Grid Pro |
| Connector-backed local | `data.connector` | The connector loads data into a local `DataTable`, then Grid handles sorting, filtering, and pagination client-side. | Grid Lite and Grid Pro |

The default model is local. When you provide `data.columns`, `data.dataTable`,
or `data.connector`, Grid uses the local provider unless you explicitly switch
to `providerType: 'remote'`.

```js
Grid.grid('container', {
    data: {
        // `data.columns` uses the default local provider.
        columns: {
            product: ['Apple', 'Pear', 'Orange'],
            price: [3.5, 2.5, 3]
        }
    }
});
```

Use the articles below to choose the right setup:

- [Client-side data handling](https://www.highcharts.com/docs/grid/data-handling/clientside)
- [Server-side data handling](https://www.highcharts.com/docs/grid/data-handling/serverside)
- [Connectors](https://www.highcharts.com/docs/grid/data-handling/connectors)

You can also register a custom data provider when neither the built-in local nor
remote model fits your data source.

## API reference

- [`data`](https://api.highcharts.com/grid/data)
- [`data.local`](https://api.highcharts.com/grid/data.local)
- [`data.remote`](https://api.highcharts.com/grid/data.remote)
