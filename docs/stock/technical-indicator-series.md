Technical indicators
===

Technical Indicators, like annotations, are powerful tools that help to understand charts and make decisions with ease. The mathematical algorithms use the existing data to indicate trends, events, etc. and help to set up boundaries for strategies and to look for patterns.

Technical indicators require the [indicators/indicators.js](https://code.highcharts.com/stock/indicators/indicators.js) main module. The main module includes SMA (Simple Moving Average). Each technical indicator, except the SMA, is a separate module and should be loaded after the main module.

A full list of supported technical indicators could be divided into two main groups. Overlays use the same scale and are plotted on the same xAxis and yAxis as the main series. The second group (oscillators and other technical indicators) requires additional yAxis because of the different extremes.


| Overlays  | Oscillators and others |
| ------------- | ------------- |
| [Acceleration Bands](https://highcharts.com/samples/stock/indicators/acceleration-bands/) | [Absolute Price Oscillator](https://highcharts.com/samples/stock/indicators/apo/) |
| [Bollinger Bands](https://highcharts.com/samples/stock/indicators/bollinger-bands/) | [A/D (Accumulation/Distribution)](https://highcharts.com/samples/stock/indicators/accumulation-distribution/) |
| [DEMA (Double Exponential Moving Average)](https://highcharts.com/samples/stock/indicators/dema/) | [Aroon](https://highcharts.com/samples/stock/indicators/aroon/) |
| [EMA (Exponential Moving Average)](https://highcharts.com/samples/stock/indicators/ema/) | [Aroon Oscillator](https://highcharts.com/samples/stock/indicators/aroon-oscillator/) |
| [Ichimoku Kinko Hyo](https://highcharts.com/samples/stock/indicators/ichimoku-kinko-hyo/) | [ATR (Average True Range)](https://highcharts.com/samples/stock/indicators/atr/) |
| [Keltner Channels](https://highcharts.com/samples/stock/indicators/keltner-channels/) | [Awesome Oscillator](https://highcharts.com/samples/stock/indicators/ao/) |
| [Linear Regression](https://highcharts.com/samples/stock/indicators/linear-regression/) | [CCI (Commodity Channel Index)](https://highcharts.com/samples/stock/indicators/cci/) |
| [Pivot Points](https://highcharts.com/samples/stock/indicators/pivot-points/) | [Chaikin](https://highcharts.com/samples/stock/indicators/chaikin/) |
| [Price Channel](https://highcharts.com/samples/stock/indicators/price-channel/) | [CMF (Chaikin Money Flow)](https://highcharts.com/samples/stock/indicators/cmf/) |
| [Price Envelopes](https://highcharts.com/samples/stock/indicators/price-envelopes/) | [CMO (Chande Momentum Oscillator)](https://highcharts.com/samples/stock/indicators/cmo/) |
| [PSAR (Parabolic SAR)](https://highcharts.com/samples/stock/indicators/psar/) | [Detrended price](https://highcharts.com/samples/stock/indicators/dpo/) |
| [SMA (Simple Moving Average)](https://highcharts.com/samples/stock/indicators/sma/) | [Disparity Index](https://highcharts.com/samples/stock/indicators/disparity-index/) |
| [Super Trend](https://highcharts.com/samples/stock/indicators/supertrend/) | [DMI (Directional Movement Index)](https://highcharts.com/samples/stock/indicators/dmi/) |
| [TEMA (Triple Exponential Moving Average)](https://highcharts.com/samples/stock/indicators/tema/) | [Klinger Oscillator](https://highcharts.com/samples/stock/indicators/klinger/) |
| [Trendline](https://highcharts.com/samples/stock/indicators/trendline/) | [Linear Regression Angle](https://highcharts.com/samples/stock/indicators/linear-regression-angle/) |
| [VbP (Volume by Price)](https://highcharts.com/samples/stock/indicators/volume-by-price/) | [Linear Regression Intercept](https://highcharts.com/samples/stock/indicators/linear-regression-intercept/) |
| [VWAP (Volume Weighted Average Price)](https://highcharts.com/samples/stock/indicators/vwap/) | [Linear Regression Slope](https://highcharts.com/samples/stock/indicators/linear-regression-slope/)  |
| [WMA (Weighted Moving Average)](https://highcharts.com/samples/stock/indicators/wma/) | [MACD (Moving Average Convergence Divergence)](https://highcharts.com/samples/stock/indicators/macd/) |
| [Zig Zag](https://highcharts.com/samples/stock/indicators/zigzag/) | [MFI (Money Flow Index)](https://highcharts.com/samples/stock/indicators/mfi/) |
| | [Momentum](https://highcharts.com/samples/stock/indicators/momentum/) |
| | [NATR (Normalized Average True Range)](https://highcharts.com/samples/stock/indicators/natr/) |
| | [OBV (On-Balance Volume)](https://highcharts.com/samples/stock/indicators/obv/) |
| | [Percentage Price oscillator](https://highcharts.com/samples/stock/indicators/ppo/) |
| | [RoC (Rate of Change)](https://highcharts.com/samples/stock/indicators/roc/) |
| | [RSI (Relative Strength Index)](https://highcharts.com/samples/stock/indicators/rsi/) |
| | [Slow Stochastic](https://highcharts.com/samples/stock/indicators/slow-stochastic/) |
| | [Stochastic](https://highcharts.com/samples/stock/indicators/stochastic/) |
| | [TRIX (Triple exponential average)](https://highcharts.com/samples/stock/indicators/trix/) |
| | [Williams %R](https://highcharts.com/samples/stock/indicators/williams-r/) |


_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highstock/plotOptions.sma)_

Technical indicators modules are implemented as series, that means almost all of the default options for [series](https://www.highcharts.com/docs/chart-concepts/series) are available. The main option, which needs to be set for an indicator, is `series.linkedTo`. That option binds an indicator to a series: an indicator will use `series.data` for all calculations, even when the dataset is changing (e.g. by `series.addPoint()`). Additionally, each indicator has its own list of parameters, available under `params` options, which allows easy customization (e.g. `params.period`, `params.algorithm`).

There are no limitations to the number of technical indicators that can be bound to one main series. The following example creates a chart with four series: one main, two SMA, and one EMA:

```js
series: [{
  id: 'main-series',
  data: [ … ]
}, {
  type: 'sma',
  linkedTo: 'main-series',
  params: {
    period: 14
  }
}, {
  type: 'sma',
  linkedTo: 'main-series',
  params: {
    period: 28
  }
}, {
  type: 'ema',
  linkedTo: 'main-series',
  params: {
    period: 7
  }
}]
```

<iframe style="width: 100%; height: 650px; border: none;" src=https://www.highcharts.com/samples/embed/stock/demo/macd-pivot-points allow="fullscreen"></iframe>

Click [here](https://highcharts.com/samples/stock/demo/macd-pivot-points) to check the code.

yAxis bindings
-------------

All Overlay type technical indicators (the ones listed in the left column of the above table, e.g. SMA, EMA, etc.) can be placed on the same yAxis as the main series. However, other technical indicators (right column, e.g. Oscillators: MACD, RSI, etc.), should use a separate yAxis. This is caused by values calculated by algorithms: yAxis extremes for the main series can be <250, 255> but for the Stochastic technical indicator, values are within <0, 100> extremes. A technical indicator can be placed on a separate yAxis as any other series:

1. Create required yAxis:

```js
yAxis: [{
  // Main series yAxis:
  height: '50%'
}, {
  // yAxis for Stochastic technical indicator:
  top: '50%',
  height: '50%'
}]
```

2. Bind indicator to this yAxis:

```js
series: [{
  id: 'main-series',
  data: [ … ]
}, {
  type: 'stochastic',
  linkedTo: 'main-series',
  yAxis: 1
}]
```

Multiple series bindings
------------------------

Some of the technical indicators require two series for calculations. Here is a full list of those indicators:

*   Accumulation/Distribution
*   Chaikin Oscillator
*   CMF
*   Klinger oscillator
*   MFI
*   OBV (On Balance Volume)
*   Volume by Price
*   Volume Weighted Average Price

These indicators require the following parameter `params.volumeSeriesID` to calculate properly:

```js
series: [{
  id: 'main-series',
  data: [ … ]
}, {
  id: 'volume-series',
  yAxis: 1,
  data: [ … ]
}, {
  type: 'mfi',
  linkedTo: 'main-series',
  yAxis: 2,
  params: {
    volumeSeriesID: 'volume-series'
  }
}]
```