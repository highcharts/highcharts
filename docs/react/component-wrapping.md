# Component wrapping

You can wrap components supported by Highcharts React to better organize your code:

```tsx
import { useState } from "react";
import { Chart, Title, Tooltip, XAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { ColumnSeries } from "@highcharts/react/series/Column";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

interface ProfitSeriesProps {
  revenue: number[];
  costs: number[];
}

function ProfitSeries({ revenue, costs }: ProfitSeriesProps) {
  const profit = revenue.map((value, index) => value - costs[index]);
  return <LineSeries data={profit} name="Profit" />;
}

function FinancialTooltip() {
  return (
    <Tooltip shared>
      <div data-hc-option="headerFormat">
        <b>{"{point.key}"}</b>
      </div>
      <div data-hc-option="pointFormat">
        {"{series.name}: "}
        <b>{"${point.y}"}</b>
      </div>
    </Tooltip>
  );
}

export default function FinancialChart() {
  const [data] = useState({
    revenue: [10000, 12000, 11000, 13000, 12000, 14000],
    costs: [7000, 8000, 8000, 9000, 8000, 9000],
  });

  return (
    <Chart>
      <Title>Financials</Title>
      <FinancialTooltip />
      <XAxis categories={MONTHS} />
      <ColumnSeries data={data.revenue} name="Revenue" />
      <ColumnSeries data={data.costs} name="Costs" />
      <ProfitSeries revenue={data.revenue} costs={data.costs} />
    </Chart>
  );
}
```

Using [React hooks](https://react.dev/reference/react/hooks) is not supported within wrapped components. Highcharts React calls wrapper functions directly, outside of React's rendering cycle, to minimize chart rendering overhead. We recommend defining state in the parent component and providing it to wrapped components via props.
