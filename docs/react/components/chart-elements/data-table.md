# DataTable

You can supply chart data in a tabular, column-oriented format using the `DataTable` component. Instead of passing data directly to each series, you store it in a shared table and map columns to series properties with [`dataMapping`](https://api.highcharts.com/highcharts/series.line.dataMapping):

```tsx
import { Chart, DataTable, PlotOptions } from "@highcharts/react";
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
      <PlotOptions series={{ dataMapping: { x: "Year" } }} />
      <LineSeries name="Revenue" dataMapping={{ y: "Revenue" }} />
    </Chart>
  );
}
```

The `DataTable` component accepts all [`dataTable` API options](https://api.highcharts.com/highcharts/dataTable) as props. The `columns` prop holds the table data keyed by column ID, and an optional `id` prop names the table so individual series can reference it via their own [`dataTable`](https://api.highcharts.com/highcharts/series.line.dataTable) option.

Each series selects which columns to read through `dataMapping`, where the keys are point properties (such as `x` and `y`) and the values are column IDs. A single `DataTable` can feed multiple series, each mapping different columns. If a column ID already matches a series key (for example `x` or `y`), the mapping for that property can be omitted.

For the underlying concepts, shared examples, and dynamic updates, see [Using DataTables with Series](https://www.highcharts.com/docs/working-with-data/using-datatables-in-series).
