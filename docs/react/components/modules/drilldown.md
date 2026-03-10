# Drilldown

You can add [drilldown](https://www.highcharts.com/docs/chart-concepts/drilldown) to your chart using the `Drilldown` component:

```tsx
import { Chart, XAxis } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";
import { Drilldown } from "@highcharts/react/modules/drilldown";

export default function DrilldownChart() {
  return (
    <Chart>
      <XAxis type="category" />
      <ColumnSeries
        data={[
          { name: "Animals", y: 5, drilldown: "animals" },
          { name: "Fruits", y: 2, drilldown: "fruits" },
        ]}
      />
      <Drilldown>
        <ColumnSeries
          data={[
            ["Cats", 3],
            ["Dogs", 5],
          ]}
          id="animals"
        />
        <ColumnSeries
          data={[
            ["Apples", 2],
            ["Oranges", 5],
          ]}
          id="fruits"
        />
      </Drilldown>
    </Chart>
  );
}
```

The `Drilldown` component accepts all [drilldown API options](https://api.highcharts.com/highcharts/drilldown) as props.
