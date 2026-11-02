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
            <Column id="name" headerFormat="Name" />
            <Column
                id="age"
                dataType="number"
                headerFormat="Age"
            />
            <Column id="city" headerFormat="City" />
        </Grid>
    );
}
```


## Column IDs

`id` is required. It is the column identity in Grid (`columns[].id`), not an
HTML id — `<Column>` does not render a DOM node.

By default the column reads data from the field with the same name as `id`.
Set `dataId` when the data field is different, or `dataId={null}` for an
unbound (virtual) column that is not tied to a data field.

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
    id="salary"
    dataType="number"
    width="20%"
    sortingEnabled
    headerFormat="Salary (USD)"
    cellFormat="${value}"
    cellClassName="text-right tabular-nums"
/>
```

For an unbound column, for example a row index, pass `id` and
`dataId={null}`:

```tsx
<Column
    id="index"
    dataId={null}
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
`evenRowClassName` exist only on `ColumnDefaults`. `id`, `dataId`, `enabled`,
and `className` exist only on `Column`. Both also accept an `options` prop
with the same JSON as Core (`columnDefaults` or `columns[]`). Flattened props
override that object.

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | Column identity. Maps to `columns[].id`. Required. `Column` only. |
| `dataId` | `string \| null` | Data-source column id. Defaults to `id`. `null` makes the column unbound. `Column` only. |
| `enabled` | `boolean` | Whether the column is rendered. `Column` only. |
| `className` | `string` | Class names on the column. `Column` only. |
| `options` | `object` | Core JSON for this column (or `columnDefaults`). Flattened props override this object. |
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
