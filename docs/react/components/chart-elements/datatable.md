---
description: >-
  Supply chart data as a column-oriented DataTable, map its columns to series
  point properties with dataMapping, pass one instance to several charts
  through the dataTable prop, or declare the table with the DataTable
  component.
---

# DataTable

You can supply chart data in a tabular, column-oriented format using a `DataTable`. Instead of passing data directly to each series, you store it in a table, and each series selects which columns to read through [`dataMapping`](https://api.highcharts.com/highcharts/series.line.dataMapping), where the keys are point properties (such as `x` and `y`) and the values are column IDs. A single table can feed multiple series, each mapping different columns. If a column ID already matches a series key (for example `x` or `y`), the mapping for that property can be omitted.

The optional `id` option names a table so that `dataMapping` can select it when a chart holds more than one.

There are two ways to provide the table:

- **The [`DataTable`](#use-the-datatable-class) class (recommended):** create an instance and pass it to the `dataTable` prop of the chart component.
- **The [`DataTable`](#use-the-datatable-component) component:** declare the table as a child of the chart component.

## Use the DataTable class

Create the table with the `DataTable` class from the [Highcharts instance](https://www.highcharts.com/docs/react/highcharts-instance) and pass it to the `dataTable` prop. For static data, create the table outside the component:

```tsx
import { Chart, Highcharts } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

const dataTable = new Highcharts.DataTable({
  columns: {
    Year: [2020, 2021, 2022, 2023],
    Revenue: [12, 18, 24, 30],
  },
});

export default function DataTableChart() {
  return (
    <Chart dataTable={dataTable}>
      <LineSeries
        name="Revenue"
        options={{ dataMapping: { x: "Year", y: "Revenue" } }}
      />
    </Chart>
  );
}
```

When the data is dynamic, for example when it comes from props, create the table in the component body:

```tsx
import { useMemo } from "react";
import { Chart, Highcharts } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

interface DataTableChartProps {
  years: number[];
  revenue: number[];
}

export default function DataTableChart({
  years,
  revenue,
}: DataTableChartProps) {
  const dataTable = useMemo(
    () =>
      new Highcharts.DataTable({
        columns: {
          Year: years,
          Revenue: revenue,
        },
      }),
    [years, revenue],
  );

  return (
    <Chart dataTable={dataTable}>
      <LineSeries
        name="Revenue"
        options={{ dataMapping: { x: "Year", y: "Revenue" } }}
      />
    </Chart>
  );
}
```

### Why use the class

A single table instance can be shared by several charts. Store all related columns in one table, and let each series select the columns it needs through `dataMapping`, instead of repeating the data in every chart.

The following example shares one table between two charts, each mapping a different column:

```tsx
import { Chart, Highcharts } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { ColumnSeries } from "@highcharts/react/series/Column";

const dataTable = new Highcharts.DataTable({
  columns: {
    Year: [2020, 2021, 2022, 2023],
    Revenue: [12, 18, 24, 30],
    Cost: [10, 11, 15, 17],
  },
});

export default function SharedTableCharts() {
  return (
    <>
      <Chart dataTable={dataTable}>
        <LineSeries
          name="Revenue"
          options={{ dataMapping: { x: "Year", y: "Revenue" } }}
        />
      </Chart>

      <Chart dataTable={dataTable}>
        <ColumnSeries
          name="Cost"
          options={{ dataMapping: { x: "Year", y: "Cost" } }}
        />
      </Chart>
    </>
  );
}
```

## Use the DataTable component

For a single chart that does not need to share its data, the `DataTable` component may read more cleanly, since the table is declared as a child of the chart component, alongside the series that read from it:

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

The `DataTable` component accepts all [dataTable API options](https://api.highcharts.com/highcharts/dataTable) as props.

To learn more about how data tables work in Highcharts, see [Using DataTables with Series](https://www.highcharts.com/docs/working-with-data/using-datatables-in-series).
