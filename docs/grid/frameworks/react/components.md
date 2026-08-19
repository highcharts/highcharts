---
sidebar_label: "Components"
---

# Components

Pass these components inside
[`Grid`](https://www.highcharts.com/docs/grid/frameworks/react/grid). `Grid`
itself is documented on that page. `Data`, `Column`, and `ColumnDefaults`
have their own articles; the tables below cover the remaining components.

```tsx
import { Grid, Data, Column, Caption } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Caption>Team directory</Caption>
            <Data
                columns={{
                    name: ['Alice', 'Bob', 'Charlie'],
                    age: [23, 34, 45]
                }}
            />
            <Column columnId="name" headerFormat="Name" />
            <Column columnId="age" dataType="number" headerFormat="Age" />
        </Grid>
    );
}
```

Components take class names. `Grid` also has `theme`, including an empty
string that turns off the default theme for utility classes such as Tailwind.

See [Styling](https://www.highcharts.com/docs/grid/frameworks/react/styling)
for class-name mapping, themes, and Tailwind.

<!-- Sample placeholder: grid/react/components
<iframe src="https://www.highcharts.com/samples/embed/grid/react/components?force-light-theme" allow="fullscreen"></iframe>
-->

## Data

`Data` supplies the rows: `columns`, a `DataTable`, or a connector. When you
change that data in React state, the grid updates.

See [Data](https://www.highcharts.com/docs/grid/frameworks/react/data) for the
props, updates, `autogenerateColumns`, and remote data.

## Columns

`ColumnDefaults` sets shared column behavior and `Column` configures one
column.

See [Columns](https://www.highcharts.com/docs/grid/frameworks/react/columns)
for the props, column IDs, and unbound columns.

## Header

`<Header>` maps to `header`. Use it to set order, hide columns, or group
headers. Each entry is a column ID string or a group object.

```tsx
import { Grid, Data, Column, Header } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Data
                columns={{
                    name: ['Alice', 'Bob'],
                    age: [23, 34],
                    city: ['New York', 'Oslo']
                }}
            />
            <Header
                header={[
                    'name',
                    {
                        format: 'Details',
                        columns: ['age', 'city']
                    }
                ]}
            />
            <Column columnId="name" headerFormat="Name" />
            <Column columnId="age" dataType="number" headerFormat="Age" />
            <Column columnId="city" headerFormat="City" />
        </Grid>
    );
}
```

When `header` is set, list every column you want visible. Columns missing from
the tree are excluded. Per-column header text still comes from `headerFormat`
or `headerFormatter` on
[`Column`](https://www.highcharts.com/docs/grid/frameworks/react/columns).

See [Column headers](https://www.highcharts.com/docs/grid/columns/header) and
[Grouped headers](https://www.highcharts.com/docs/grid/columns/grouping).

| Prop | Type | Description |
| --- | --- | --- |
| `header` | `Array<string \| object>` | Header tree. A string is a column ID. An object can group or configure a header cell (`columnId`, `format`, `className`, `columns`, `accessibility`). |

## Caption

Table caption. The text inside `<Caption>` is the caption.

```tsx
import { Grid, Data, Caption } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Caption htmlTag="h2">Team directory</Caption>
            <Data
                columns={{
                    name: ['Alice', 'Bob'],
                    age: [23, 34]
                }}
            />
        </Grid>
    );
}
```

| Prop | Type | Description |
| --- | --- | --- |
| `className` | `string` | Class names on the caption. |
| `htmlTag` | `string` | HTML tag for the caption element. |

## Description

Table description. The text inside `<Description>` is the description.

```tsx
import { Grid, Data, Description } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Description>Employees by name and age.</Description>
            <Data
                columns={{
                    name: ['Alice', 'Bob'],
                    age: [23, 34]
                }}
            />
        </Grid>
    );
}
```

| Prop | Type | Description |
| --- | --- | --- |
| `className` | `string` | Class names on the description. |

## Pagination

Page size and pagination controls. Rendering `<Pagination />` sets `enabled` to
`true` unless you pass `false`. Place it before the other components to render
controls above the table, or after them to render controls below. See
[Row pagination](https://www.highcharts.com/docs/grid/rows/pagination).

```tsx
import { Grid, Data, Pagination } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Data
                columns={{
                    name: ['Alice', 'Bob', 'Charlie', 'David'],
                    age: [23, 34, 45, 56]
                }}
            />
            <Pagination pageSize={2} />
        </Grid>
    );
}
```

| Prop | Type | Description |
| --- | --- | --- |
| `enabled` | `boolean` | Whether pagination is rendered. Defaults to `true` when the component is used. |
| `page` | `number` | Current page. |
| `pageSize` | `number` | Rows per page. |
| `pageSizeOptions` | `number[]` | Options in the page-size selector. |
| `align` | `'left' \| 'center' \| 'right' \| 'distributed'` | Alignment of pagination elements. |
| `pageInfo` | `boolean` | Show page information text. |
| `pageSizeSelector` | `boolean` | Show the page-size selector. |
| `pageButtons` | `boolean` | Show numbered page buttons. |
| `pageButtonsCount` | `number` | Maximum number of page buttons before ellipsis. |
| `firstLast` | `boolean` | Show first and last buttons. |
| `previousNext` | `boolean` | Show previous and next buttons. |
| `className` | `string` | Class names on `.hcg-pagination`. |
| `infoClassName` | `string` | Class names on the page info element. |
| `controlsClassName` | `string` | Class names on the controls container. |
| `sizeClassName` | `string` | Class names on the page-size container. |
