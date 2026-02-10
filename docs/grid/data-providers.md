# Data providers
Data providers are the bridge between Grid and your data source. A provider is responsible for reading values for rendering, applying query modifiers (sorting, filtering, paging), and persisting edits such as cell value changes.

Providers are configured under the `data` option. The `providerType` selects which provider to use and the rest of the `data` object is passed as provider-specific options.

## LocalDataProvider (default)
When you provide `data.dataTable`, Grid uses `LocalDataProvider` by default. It works entirely in memory and is a good fit for fully-loaded datasets and [Data Modifiers](https://www.highcharts.com/docs/dashboards/data-modifiers).

```js
Grid.grid('container', {
    data: {
        providerType: 'local', // optional
        dataTable: {
            columns: {
                product: ["Apple", "Pear", "Orange", "Banana"],
                weight: [182, 178, 150, 120],
                price: [3.5, 2.5, 3, 2.2]
            }
        }
    }
});
```

You can also pass a `DataTable` instance instead of serialized options.

## RemoteDataProvider (Grid Pro)
Grid Pro includes `RemoteDataProvider` for server-backed data. Use it when you want to page, filter, or sort on the server and fetch rows on demand.

Configure it by setting `providerType: 'remote'` and supplying either a custom `fetchCallback` or a serialized `dataSource`. If you want cell editing to persist changes remotely, provide `setValueCallback`.

### Fetch callback
Use `fetchCallback` when you want full control over how Grid queries your backend. The callback receives the current query state plus `offset`, `limit`, and an optional `AbortSignal`, and must return columns and total row count.

```js
Grid.grid('container', {
    data: {
        providerType: 'remote',
        fetchCallback: async (query, offset, limit, signal) => {
            const response = await fetch('/api/grid', { signal });
            const result = await response.json(); // You can parse/transform here.
            // { columns: { ... }, totalRowCount: 123, rowIds?: [...] }
            return result;
        },
        setValueCallback: async (columnId, rowId, value) => {
            await fetch('/api/grid/cell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ columnId, rowId, value })
            });
        },
        // Optional: rows per fetched chunk.
        chunkSize: 200,
        // Optional: LRU cache size for chunks (unset keeps all).
        chunksLimit: 20,
        // Optional: request policy for rapid query changes defaults to 'latest' (set to 'all' to keep all in-flight requests).
        requestPolicy: 'latest'
    }
});
```

Because the callback is a function, it is not serializable and can be verbose to keep in sync with query logic (sorting, filtering, paging). For a serialized configuration, use the Data Source helper via `dataSource`.

### Data Source helper
When you provide `dataSource`, Grid uses the Data Source helper to build request URLs from query state and to parse the response.

```js
Grid.grid('container', {
    data: {
        providerType: 'remote',
        dataSource: {
            urlTemplate:
                '/api/grid?page={page}&pageSize={pageSize}&' +
                'sortBy={sortBy}&sortOrder={sortOrder}&filter={filter}'
        }
    }
});
```

Optional `dataSource` configuration:
```js
dataSource: {
    urlTemplate: '/api/grid?foo={foo}&...',
    templateVariables: {
        // Extend the template with custom variables.
        foo: (state) => state.query?.something ?? ''
    },
    // Removes empty query parameters from the URL.
    omitEmpty: true, 
    parseResponse: async (res) => {
        // Parse the response into { columns, totalRowCount, rowIds? }.
        const { data, meta } = await res.json();
        return {
            columns: data || {},
            totalRowCount: meta?.totalRowCount || 0,
            rowIds: meta?.rowIds
        };
    },
    // Request timeout in ms (use 0 to disable).
    fetchTimeout: 30000,
    // Column that contains stable row IDs.
    rowIdColumn: 'id'
}
```

## Custom data providers
You can implement your own provider by extending the `DataProvider` base class and registering it in the provider registry.

```ts
class MyProvider extends DataProvider {
    // Implement the abstract methods defined by DataProvider.
}

DataProviderRegistry.registerDataProvider('myProvider', MyProvider);
```

Then select it in your Grid options:

```js
Grid.grid('container', {
    data: {
        providerType: 'myProvider'
        // ...custom provider options
    }
});
```

## Row pinning support
Row pinning is provider-aware and works with both `local` and `remote`
providers.

- Pinned rows are rendered in dedicated top/bottom sections and excluded from
  the scrollable area.
- Pagination applies only to scrollable rows; pinned rows remain visible.
- Sorting/filtering include/exclude behavior is the same across providers.
