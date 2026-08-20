---
sidebar_label: "Data"
---

# Data

`<Data>` maps to the root `data` option. The same object can go on `Grid`'s
`options.data`. Keep the values in React state, pass them as `columns`, and
the grid updates when that state changes.

```tsx
import { useState } from 'react';
import { Grid, Data, Column } from '@highcharts/grid-lite-react';

export default function App() {
    const [columns, setColumns] = useState({
        name: ['Alice', 'Bob'],
        age: [23, 34]
    });

    const loadMore = () => {
        setColumns({
            name: ['Alice', 'Bob', 'Charlie'],
            age: [23, 34, 45]
        });
    };

    return (
        <>
            <Grid>
                <Data columns={columns} />
                <Column columnId="name" headerFormat="Name" />
                <Column columnId="age" dataType="number" headerFormat="Age" />
            </Grid>
            <button type="button" onClick={loadMore}>Load more</button>
        </>
    );
}
```

Do not call `grid.update()` for this. Change state, pass new props, and let the
React package update the instance. See
[Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid) if you need
the instance for other APIs.

Local columns, `DataTable`, connectors, and remote querying are documented in
[Data handling](https://www.highcharts.com/docs/grid/data-handling/overview).
The sections below cover the `Data` component only.

<!-- Sample placeholder: grid/react/data
<iframe src="https://www.highcharts.com/samples/embed/grid/react/data?force-light-theme" allow="fullscreen"></iframe>
-->

## `columns`

`columns` is an object of arrays. Each key is a column ID, the same value as
`columnId` on
[`Column`](https://www.highcharts.com/docs/grid/frameworks/react/columns).

Keep this object in `useState` when it can change. A new object created during
render will update the grid on every render.

## `autogenerateColumns`

By default, Grid generates columns from the data keys. When you render
`<Column>` components, the React package sets `autogenerateColumns` to `false`
unless you pass the prop yourself. Only declared `<Column>`s (and columns
listed in
[`Header`](https://www.highcharts.com/docs/grid/frameworks/react/components#header))
are shown.

```tsx
<Data columns={columns} autogenerateColumns />
```

Pass `true` when the data already defines the columns and `<Column>` only
overrides a few of them. Leave the default when `<Column>` is the source of
which columns exist. See
[Columns overview](https://www.highcharts.com/docs/grid/columns/index#working-with-data-autogeneratecolumns).

## `DataTable`

The React packages re-export `DataTable` from Grid:

```tsx
import { Grid, Data, DataTable } from '@highcharts/grid-lite-react';

const dataTable = new DataTable({
    columns: {
        name: ['Alice', 'Bob', 'Charlie'],
        age: [23, 34, 45]
    }
});

export default function App() {
    return (
        <Grid>
            <Data dataTable={dataTable} />
        </Grid>
    );
}
```

Set `updateOnChange` when the same `DataTable` instance should push changes
into the grid:

```tsx
<Data dataTable={dataTable} updateOnChange />
```

Read more about the DataTable class in
[Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid)
and in the
[Dashboards DataTable article](https://www.highcharts.com/docs/dashboards/data-table).

## Connectors and remote data

Pass a connector or `providerType` on `<Data>` the same way as on `data` in
Core:

```tsx
<Data connector={connector} />
```

```tsx
<Data providerType="remote" />
```

Remote / server-side querying is Grid Pro. See
[Connectors](https://www.highcharts.com/docs/grid/data-handling/connectors)
and
[Server-side data handling](https://www.highcharts.com/docs/grid/data-handling/serverside).
For in-memory sorting, filtering, and paging after load, see
[Client-side data handling](https://www.highcharts.com/docs/grid/data-handling/clientside).

## `idColumn`

`idColumn` is the data field that holds a stable unique row ID. Pass it when
rows must stay identifiable across updates, for example after sorting,
filtering, or loading more data.

## The options object

Data can also go on `Grid`'s `options.data` instead of `<Data>`. If both are
set, `options` wins. See
[Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid#combining-components-and-options).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `Record<string, Array<boolean \| null \| number \| string \| undefined>>` | - | Column ID to cell-value arrays. |
| `dataTable` | `DataTable` | - | Existing DataTable instance. |
| `connector` | `object` | - | Connector instance or connector options. |
| `providerType` | `string` | `'local'` | Data provider. `'remote'` is Grid Pro. |
| `autogenerateColumns` | `boolean` | `true` (`false` when `<Column>` is used) | Whether to render columns from the data keys automatically. |
| `updateOnChange` | `boolean` | `false` | Update the grid when the same `DataTable` instance changes. |
| `idColumn` | `string` | - | Column ID that holds a stable unique row ID. |
