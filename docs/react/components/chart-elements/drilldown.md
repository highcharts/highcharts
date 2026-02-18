# Drilldown

You can add [drilldown](https://www.highcharts.com/docs/chart-concepts/drilldown) to your chart using the `Drilldown` component:

```tsx
import { Chart, Series } from "@highcharts/react";
import { Drilldown } from "@highcharts/react/options/drilldown";

export default function DrilldownChart() {
  return (
    <Chart
      options={{
        chart: {
          type: "column",
        },
        xAxis: {
          type: "category",
        },
      }}
    >
      <Series
        data={[
          { name: "Animals", y: 5, drilldown: "animals" },
          { name: "Fruits", y: 2, drilldown: "fruits" },
        ]}
      />
      <Drilldown>
        <Series
          data={[
            ["Cats", 3],
            ["Dogs", 5],
          ]}
          id="animals"
        />
        <Series
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
