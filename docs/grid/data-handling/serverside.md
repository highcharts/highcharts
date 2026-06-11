---
sidebar_label: "Server-side"
tags: ["grid-pro"]
---

# Server-side data handling

Server-side data handling is available through Grid Pro and uses
`providerType: 'remote'`.

Use this model when your backend should handle sorting, filtering, and
pagination before the current rows are returned to the Grid.

## How it works

With the remote provider, Grid tracks the current query state and re-fetches
data when sorting, filtering, or pagination changes. This is the only built-in
mode intended for true server-side query handling.

Remote data can be configured in two ways:

- `fetchCallback` for full control over the request and response handling
- `dataSource` for a serialized URL-template based setup

If users can edit cells and those changes should be persisted remotely, add
`setValueCallback`.

## Fetch callback

```js
Grid.grid('container', {
    data: {
        providerType: 'remote',
        fetchCallback: async (query, offset, limit, signal) => {
            const params = new URLSearchParams({
                // Request the current slice of rows.
                offset: String(offset),
                limit: String(limit),
                // Forward the current Grid query state.
                sorting: JSON.stringify(query.sorting.currentSortings || []),
                filtering: JSON.stringify(
                    query.filtering.modifier?.options || null
                )
            });

            const response = await fetch(`/api/grid?${params}`, { signal });
            const result = await response.json();

            return {
                columns: result.columns,
                totalRowCount: result.totalRowCount,
                rowIds: result.rowIds,
                // Optional: effective page size used by the backend.
                pageSize: result.pageSize
            };
        },
        setValueCallback: async (columnId, rowId, value) => {
            await fetch('/api/grid/cell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ columnId, rowId, value })
            });
        },
        // Optional: rows per fetched chunk.
        chunkSize: 200,
        // Optional: LRU cache size for chunks (unset keeps all).
        chunksLimit: 20,
        // Optional: request policy for rapid query changes.
        requestPolicy: 'latest'
    }
});
```

Use `fetchCallback` when you want full control over how Grid queries your
backend. The callback receives the current query state plus `offset`, `limit`,
and an optional `AbortSignal`. In the example above, `offset` and `limit` are
sent as request parameters, `query` is used to forward sorting and filtering
state, `signal` is passed to `fetch`, and the callback returns the expected
`columns`, `totalRowCount`, optional `rowIds`, and optional `pageSize`.

Return `pageSize` when the backend can clamp or otherwise adjust the requested
page size. This keeps the Grid chunk indexing aligned with the actual response.

## Data Source helper

```js
Grid.grid('container', {
    data: {
        providerType: 'remote',
        dataSource: {
            urlTemplate:
                '/api/grid?page={page}&pageSize={pageSize}&' +
                'sortBy={sortBy}&sortOrder={sortOrder}&filter={filter}'
        },
        // ID of the column that contains stable row IDs. If not set, uses
        // `rowIds` from the fetch result or generated row indices.
        idColumn: 'employeeId',
        setValueCallback: async (columnId, rowId, value) => {
            await fetch('/api/grid/cell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ columnId, rowId, value })
            });
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    pagination: {
        enabled: true,
        pageSize: 25
    }
});
```

When you provide `dataSource`, Grid uses the Data Source helper to build request
URLs from query state and to parse the response.

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
        // Parse the response into
        // { columns, totalRowCount, rowIds?, pageSize? }.
        const { data, meta } = await res.json();

        return {
            columns: data || {},
            totalRowCount: meta?.totalRowCount || 0,
            rowIds: meta?.rowIds,
            pageSize: meta?.pageSize
        };
    },
    // Request timeout in ms (use 0 to disable).
    fetchTimeout: 30000
}
```

## fetchCallback vs. dataSource

Use `fetchCallback` when:

- request building must be fully custom
- the backend response needs custom transformation
- you want direct access to the current query state and abort signal

Use `dataSource` when:

- a URL template is enough
- you want the built-in query serialization for page, page size, sort, and filter
- you want a serializable configuration

## Row IDs and editing

Use `idColumn` when one of the returned columns contains stable row IDs. If it
is not set, the remote provider falls back to `rowIds` from the response or to
generated row indices.

Use `setValueCallback` when edited cell values should be saved on the server.
Without it, remote editing cannot be persisted.

## Remote vs. connector-backed local

Do not use `data.connector` when you need the backend to handle sorting,
filtering, or pagination. A connector can fetch remote data, but once it is
loaded into Grid it still uses the local provider model and queries happen
client-side.

## API reference

- [`data.remote`](https://api.highcharts.com/grid/data.remote)
- [`data.remote.dataSource`](https://api.highcharts.com/grid/data.remote.dataSource)
