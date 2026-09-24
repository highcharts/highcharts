# DataTable

You can supply chart data in a tabular, column-oriented format using the `DataTable` component. Instead of passing data directly to each series, you store it in a shared table and map columns to series properties with [`dataMapping`](https://api.highcharts.com/highcharts/series.line.dataMapping):

```tsx
import { Chart, DataTable } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function DataTableChart() {
  return (
    <Chart>
      <DataTable
        columns={{
          Year: [2020, 2021, 2022, 2023],
          Revenue: [12, 18, 24, 30],
        }}
      />
      <LineSeries
        name="Revenue"
        options={{ dataMapping: { x: "Year", y: "Revenue" } }}
      />
    </Chart>
  );
}
```

The `DataTable` component accepts all [`dataTable` API options](https://api.highcharts.com/highcharts/dataTable) as props. The `columns` prop holds the table data keyed by column ID, and an optional `id` prop names the table so `dataMapping` can select it when a chart holds more than one. The table can also be set with the `dataTable` prop on `<Chart>` instead of as a child component.

Each series selects which columns to read through `dataMapping`, where the keys are point properties (such as `x` and `y`) and the values are column IDs. A single `DataTable` can feed multiple series, each mapping different columns. If a column ID already matches a series key (for example `x` or `y`), the mapping for that property can be omitted.

## Multiple tables

The chart-level [`dataTable`](https://api.highcharts.com/highcharts/dataTable) option is array-type, so one chart can hold several tables. A plain column ID in `dataMapping` resolves against the first table only. To read from any other table, pass an object with `column` and `dataTable`, where `dataTable` is that table's `id`:

```tsx
<Chart>
  <DataTable id="sales" columns={{ Year: [2020, 2021], Revenue: [12, 18] }} />
  <DataTable id="costs" columns={{ Cost: [8, 11] }} />
  <LineSeries name="Revenue" dataMapping={{ x: "Year", y: "Revenue" }} />
  <LineSeries
    name="Cost"
    dataMapping={{ x: "Year", y: { column: "Cost", dataTable: "costs" } }}
  />
</Chart>
```

Both series map `x` from `Year` with a plain column ID, because `sales` is the first table. `Cost` needs the object form because it lives in the second.

## Series-level tables

A series can carry its own table instead of reading from a chart-level one, through its [`dataTable`](https://api.highcharts.com/highcharts/series.line.dataTable) option. Use this when each series has its own data rather than sharing columns:

```tsx
<Chart>
  <LineSeries
    name="Revenue"
    options={{ dataTable: { columns: { y: [12, 18, 24] } } }}
  />
  <LineSeries
    name="Cost"
    options={{ dataTable: { columns: { y: [8, 11, 15] } } }}
  />
</Chart>
```

A series-level table takes precedence over the chart-level one. Each table here holds a single column named `y`, which is already a series key, so neither series needs `dataMapping`.

For the underlying concepts, shared examples, and dynamic updates, see [Using DataTables with Series](https://www.highcharts.com/docs/working-with-data/using-datatables-in-series).
