---
sidebar_label: "Column"
---

# Column

`<Column>` configures one column and maps to `columns[]`. `ColumnDefaults`
sets shared options for every column (`columnDefaults`). React props are
flattened, so `sortingEnabled` becomes `sorting.enabled` and `cellFormat`
becomes `cells.format`. The option tree is in
[Columns overview](https://www.highcharts.com/docs/grid/columns/index).

```tsx
import {
    Grid,
    Data,
    Column,
    ColumnDefaults
} from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Data
                columns={{
                    name: ['Alice', 'Bob', 'Charlie', 'David'],
                    age: [23, 34, 45, 56],
                    city: ['New York', 'Oslo', 'Paris', 'Tokyo']
                }}
            />
            <ColumnDefaults
                sortingEnabled
                filteringEnabled
                headerClassName="bg-slate-50 p-4 font-semibold"
                cellClassName="p-4"
            />
            <Column columnId="name" headerFormat="Name" />
            <Column
                columnId="age"
                dataType="number"
                headerFormat="Age"
            />
            <Column columnId="city" headerFormat="City" />
        </Grid>
    );
}
```

<!-- Sample placeholder: grid/react/columns
<iframe src="" allow="fullscreen"></iframe>
-->

## Column IDs

`columnId` is the data field the column configures. In the Grid options object
it is `columns[].id`.

Which columns are shown when you mix `<Column>` with generated columns is
controlled by `autogenerateColumns` on
[`Data`](https://www.highcharts.com/docs/grid/frameworks/react/data#autogeneratecolumns).

## ColumnDefaults

`<ColumnDefaults>` sets options for every column. Per-column `<Column>` props
override those defaults.

`rowClassName` and `evenRowClassName` exist only on `ColumnDefaults`. They map
to `rendering.rows.className` and `rendering.rows.evenClassName`, not to
column options. Class names on cells and rows, including how defaults merge
with a column, are in
[Styling](https://www.highcharts.com/docs/grid/frameworks/react/styling).

## Column

Each `<Column>` becomes one entry in `columns[]`.

```tsx
<Column
    columnId="salary"
    dataType="number"
    width="20%"
    sortingEnabled
    headerFormat="Salary (USD)"
    cellFormat="${value}"
    cellClassName="text-right tabular-nums"
/>
```

Omit `columnId` for an unbound column, for example a row index:

```tsx
<Column
    headerFormat="#"
    width={40}
    cellValueGetter={function () {
        return String(this.row.index + 1);
    }}
/>
```

If you also use
[`Header`](https://www.highcharts.com/docs/grid/frameworks/react/components#header),
include that column in the header tree or it will not render.

Sorting, filtering, resizing, and cell formatting behave as in the rest of
Grid. See
[Sorting](https://www.highcharts.com/docs/grid/columns/sorting),
[Filtering](https://www.highcharts.com/docs/grid/columns/filtering),
[Width and resizing](https://www.highcharts.com/docs/grid/columns/resizing-and-width),
and [Cell formatting](https://www.highcharts.com/docs/grid/cells/formatting).

## Props

`Column` and `ColumnDefaults` share most props. `rowClassName` and
`evenRowClassName` exist only on `ColumnDefaults`. `columnId`, `enabled`,
`className`, and `id` exist only on `Column`.

| Prop | Type | Description |
| --- | --- | --- |
| `columnId` | `string` | Data field this column configures. Becomes `columns[].id`. `Column` only. |
| `enabled` | `boolean` | Whether the column is rendered. `Column` only. |
| `className` | `string` | Class names on the column. `Column` only. |
| `id` | `string` | HTML `id` for styling hooks. Not passed into Grid options. `Column` only. |
| `dataType` | `'string' \| 'number' \| 'boolean' \| 'datetime'` | Column data type. |
| `width` | `number \| string` | Column width. |
| `exportable` | `boolean` | Include the column in export. |
| `sortingEnabled` | `boolean` | Enable sorting from the header. |
| `sortingOrder` | `'asc' \| 'desc' \| null` | Initial sort order. |
| `sortingPriority` | `number` | Multi-column sort priority. |
| `sortingOrderSequence` | `Array<'asc' \| 'desc' \| null>` | Cycle of sort states when the header is clicked. |
| `sortingCompare` | `function` | Custom compare function. |
| `filteringEnabled` | `boolean` | Enable filtering. |
| `filteringInline` | `boolean` | Show an inline filter in the header. |
| `filteringCondition` | `string` | Initial filter condition. |
| `filteringValue` | `string \| number \| boolean \| null` | Initial filter value. |
| `headerFormat` | `string` | Header text template. |
| `headerFormatter` | `function` | Header text callback. |
| `headerClassName` | `string` | Class names on header cells. |
| `cellFormat` | `string` | Cell text template. |
| `cellFormatter` | `function` | Cell text callback. |
| `cellClassName` | `string` | Class names on body cells. |
| `cellValueGetter` | `function` | Custom cell value. `this.row.index` is the row index. |
| `cellRowHeader` | `boolean` | Render the cell as a row header. |
| `cellContextMenu` | `object` | Context menu for cells. |
| `rowClassName` | `string` | Class names on every body row. `ColumnDefaults` only. |
| `evenRowClassName` | `string` | Class names on even body rows. `ColumnDefaults` only. |
