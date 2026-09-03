# StockTools

You can add the stock tools to your stock chart using the `StockTools` component:

```tsx
import { StockChart } from "@highcharts/react/Stock";
import { CandlestickSeries } from "@highcharts/react/series/Candlestick";
import { StockTools } from "@highcharts/react/modules/StockTools";

export default function StockToolsChart() {
  return (
    <StockChart>
      <StockTools />
      <CandlestickSeries
        data={[
          [1609459200000, 100, 110, 90, 105],
          [1609545600000, 105, 115, 95, 110],
          [1609632000000, 110, 120, 100, 115],
        ]}
      />
    </StockChart>
  );
}
```

The `StockTools` component accepts all [stockTools API options](https://api.highcharts.com/highstock/stockTools) as props.

To learn more, explore [Highcharts Stock tools](https://www.highcharts.com/docs/stock/stock-tools).
