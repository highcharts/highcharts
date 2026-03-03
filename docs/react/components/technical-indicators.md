# Technical indicators

You can add technical indicators to your stock chart using dedicated indicator components:

```tsx
import { StockChart } from "@highcharts/react/Stock";
import { CandlestickSeries } from "@highcharts/react/series/Candlestick";
import { SMASeries } from "@highcharts/react/indicators/SMA";
import { EMASeries } from "@highcharts/react/indicators/EMA";
import { RSISeries } from "@highcharts/react/indicators/RSI";
import { MACDSeries } from "@highcharts/react/indicators/MACD";

// Fetch stock data`
const stockData = await fetch(
  "https://demo-live-data.highcharts.com/aapl-ohlc.json",
).then((res) => (res.ok ? res.json() : null));

export default function TechnicalIndicatorsChart() {
  return (
    <StockChart
      options={{
        plotOptions: {
          series: {
            dataGrouping: {
              enabled: false,
            },
          },
        },
      }}
    >
      <CandlestickSeries
        id="price"
        data={stockData}
        options={{ name: "AAPL" }}
      />
      <SMASeries options={{ linkedTo: "price", params: { period: 14 } }} />
      <EMASeries options={{ linkedTo: "price", params: { period: 26 } }} />
      <RSISeries options={{ linkedTo: "price", params: { period: 14 } }} />
      <MACDSeries
        options={{
          linkedTo: "price",
          params: { shortPeriod: 12, longPeriod: 26, signalPeriod: 9 },
        }}
      />
    </StockChart>
  );
}
```

**Note:** To learn more about the `StockChart` component, see the [Chart documentation](https://www.highcharts.com/docs/react/components/chart#highcharts-stock).

### Props

Technical indicators are implemented as series and accept the same [props](https://www.highcharts.com/docs/react/components/series-types#props).

## Available components

| Indicator                 | Component                             |
| ------------------------- | ------------------------------------- |
| abands                    | `<ABandsSeries />`                    |
| ad                        | `<ADSeries />`                        |
| ao                        | `<AOSeries />`                        |
| apo                       | `<APOSeries />`                       |
| aroon                     | `<AroonSeries />`                     |
| aroonoscillator           | `<AroonOscillatorSeries />`           |
| atr                       | `<ATRSeries />`                       |
| bb                        | `<BBSeries />`                        |
| cci                       | `<CCISeries />`                       |
| chaikin                   | `<ChaikinSeries />`                   |
| cmf                       | `<CMFSeries />`                       |
| cmo                       | `<CMOSeries />`                       |
| dema                      | `<DEMASeries />`                      |
| disparityindex            | `<DisparityIndexSeries />`            |
| dmi                       | `<DMISeries />`                       |
| dpo                       | `<DPOSeries />`                       |
| ema                       | `<EMASeries />`                       |
| ikh                       | `<IKHSeries />`                       |
| keltnerchannels           | `<KeltnerChannelsSeries />`           |
| klinger                   | `<KlingerSeries />`                   |
| linearregression          | `<LinearRegressionSeries />`          |
| linearregressionangle     | `<LinearRegressionAngleSeries />`     |
| linearregressionintercept | `<LinearRegressionInterceptSeries />` |
| linearregressionslope     | `<LinearRegressionSlopeSeries />`     |
| macd                      | `<MACDSeries />`                      |
| mfi                       | `<MFISeries />`                       |
| momentum                  | `<MomentumSeries />`                  |
| natr                      | `<NATRSeries />`                      |
| obv                       | `<OBVSeries />`                       |
| pc                        | `<PCSeries />`                        |
| pivotpoints               | `<PivotPointsSeries />`               |
| ppo                       | `<PPOSeries />`                       |
| priceenvelopes            | `<PriceEnvelopesSeries />`            |
| psar                      | `<PSARSeries />`                      |
| roc                       | `<ROCSeries />`                       |
| rsi                       | `<RSISeries />`                       |
| slowstochastic            | `<SlowStochasticSeries />`            |
| sma                       | `<SMASeries />`                       |
| stochastic                | `<StochasticSeries />`                |
| supertrend                | `<SupertrendSeries />`                |
| tema                      | `<TEMASeries />`                      |
| trendline                 | `<TrendLineSeries />`                 |
| trix                      | `<TRIXSeries />`                      |
| vbp                       | `<VBPSeries />`                       |
| vwap                      | `<VWAPSeries />`                      |
| williamsr                 | `<WilliamsRSeries />`                 |
| wma                       | `<WMASeries />`                       |
| zigzag                    | `<ZigzagSeries />`                    |
