---
sidebar_label: "Styling"
---

# Styling

Highcharts Grid is designed with theming in mind. In React you can still use
the default theme and CSS variables, or turn that theme off and style the table
with your own classes — including Tailwind utilities.

The React package exposes class names at three layers: the mount container, the
table, and individual child components. For CSS variables and theme files, see
[Theming overview](https://www.highcharts.com/docs/grid/theming/index).

## Class names on Grid

These props belong on
[`Grid`](https://www.highcharts.com/docs/grid/frameworks/react/grid):

| Prop | Applies to |
| --- | --- |
| `className` | The React wrapper around the grid. React-only; not a Grid option. |
| `tableClassName` | The table (`.hcg-table`). Maps to `rendering.table.className`. |
| `theme` | The theme class on the grid container. Maps to `rendering.theme`. |

```tsx
<Grid
    className="rounded-xl border border-slate-200 bg-white p-4"
    tableClassName="w-full"
>
    <Data columns={columns} />
</Grid>
```

## Default theme

If `theme` is omitted, Grid applies `hcg-theme-default`. That class adds
padding, borders, and control chrome.

To keep the default and add a class of your own:

```tsx
<Grid theme="hcg-theme-default theme-brand">
    <Data columns={columns} />
</Grid>
```

## Tailwind

Pass `theme=""` to skip the default theme and style the table with Tailwind,
or any other classes. If you leave `theme` out, Grid keeps
`hcg-theme-default`.

```tsx
<Grid
    theme=""
    className="rounded-xl border border-slate-200 bg-white p-4"
    tableClassName="w-full"
>
    <Data columns={columns} />
    <ColumnDefaults
        headerClassName="bg-slate-50 p-4 font-semibold text-slate-700"
        cellClassName="p-4 text-slate-600"
        rowClassName="hover:bg-slate-50"
        evenRowClassName="bg-slate-50/50"
    />
    <Column columnId="name" headerFormat="Name" />
</Grid>
```

<!-- Sample placeholder: grid/react/styling
<iframe src="https://www.highcharts.com/samples/embed/grid/react/styling?force-light-theme" allow="fullscreen"></iframe>
-->

## Columns and rows

Shared header and cell classes go on `ColumnDefaults`. A `Column` can add its
own classes; the two lists are merged.

```tsx
<ColumnDefaults
    headerClassName="p-4 border-b font-semibold"
    cellClassName="p-4 border-b"
    rowClassName="hover:bg-slate-50"
    evenRowClassName="bg-slate-50/50"
/>
<Column
    columnId="name"
    headerFormat="Name"
    cellClassName="font-semibold"
/>
<Column
    columnId="salary"
    headerFormat="Salary"
    headerClassName="text-right"
    cellClassName="text-right tabular-nums"
/>
```

`rowClassName` and `evenRowClassName` exist only on `ColumnDefaults`. See
[Column](https://www.highcharts.com/docs/grid/frameworks/react/column) for
the full prop list, and
[Cells: styling and theming](https://www.highcharts.com/docs/grid/cells/styling-and-theming)
for CSS on cell elements.

## Caption, Description, and Pagination

The same `className` pattern works on the caption, the description, and
pagination. Use it to space the title, tone down the description, or align
the pager with the rest of the UI.

Pagination also has separate class names for the page text (`infoClassName`),
the buttons (`controlsClassName`), and the page-size selector
(`sizeClassName`).

```tsx
<Caption className="mb-2 text-2xl font-semibold">Team directory</Caption>
<Description className="mb-4 text-sm text-slate-500">
    Filter, sort, and page through employee rows.
</Description>
<Pagination
    pageSize={5}
    className="mt-2 pt-2"
    infoClassName="text-sm font-semibold"
    controlsClassName="gap-2"
    sizeClassName="gap-2 text-sm"
/>
```

See [Components](https://www.highcharts.com/docs/grid/frameworks/react/components)
for the prop tables.

## CSS variables

If the grid still uses a theme class, prefer `--hcg-*` variables over
overriding internal selectors. See
[Grid variables](https://www.highcharts.com/docs/grid/theming/grid-variables)
and
[Element variables](https://www.highcharts.com/docs/grid/theming/element-variables).
