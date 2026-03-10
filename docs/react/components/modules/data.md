# Data

You can add the [data module](https://www.highcharts.com/docs/working-with-data/data-module) to your chart using the `Data` component:

```tsx
import { Chart } from "@highcharts/react";
import { Data } from "@highcharts/react/modules/data";

const csvData = `Month,Sales,Expenses
Jan,100,80
Feb,120,90
Mar,90,70
Apr,150,110
May,130,95`;

export default function DataChart() {
  return (
    <Chart>
      <Data csv={csvData} />
    </Chart>
  );
}
```

The `Data` component accepts all [data API options](https://api.highcharts.com/highcharts/data) as props.
