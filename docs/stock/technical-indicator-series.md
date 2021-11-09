Technical indicators
===

Technical Indicators, like annotations, are powerful tools that help to understand charts and make decisions with ease. The mathematical algorithms use the existing data to indicate trends, events, etc. and help to set up boundaries for strategies and to look for patterns.

Technical indicators require the [indicators/indicators.js](https://code.highcharts.com/stock/indicators/indicators.js) main module. The main module includes SMA (Simple Moving Average). Each technical indicator, except the SMA, is a separate module and should be loaded after the main module.

A full list of supported technical indicators could be divided into two main groups. Overlays use the same scale and are plotted on the same xAxis and yAxis as the main series. The second group (oscillators and other technical indicators) requires additional yAxis because of the different extremes.


| Overlays  | Oscillators and others |
| ------------- | ------------- |
| [Acceleration Bands](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/acceleration-bands/) | [Absolute Price Oscillator](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/apo/) |
| [Bollinger Bands](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/bollinger-bands/) | [A/D (Accumulation/Distribution)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/accumulation-distribution/) |
| [DEMA (Double Exponential Moving Average)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/dema/) | [Aroon](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/aroon/) |
| [EMA (Exponential Moving Average)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/ema/) | [Aroon Oscillator](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/aroon-oscillator/) |
| [Ichimoku Kinko Hyo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/ichimoku-kinko-hyo/) | [ATR (Average True Range)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/atr/) |
| [Keltner Channels](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/keltner-channels/) | [Awesome Oscillator](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/ao/) |
| [Linear Regression](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/linear-regression/) | [CCI (Commodity Channel Index)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/cci/) |
| [Pivot Points](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/pivot-points/) | [Chaikin](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/chaikin/) |
| [Price Channel](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/price-channel/) | [CMF (Chaikin Money Flow)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/cmf/) |
| [Price Envelopes](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/price-envelopes/) | [CMO (Chande Momentum Oscillator)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/cmo/) |
| [PSAR (Parabolic SAR)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/psar/) | [Detrended price](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/dpo/) |
| [SMA (Simple Moving Average)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/sma/) | [Disparity Index](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/disparity-index/) |
| [Super Trend](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/supertrend/) | [DMI (Directional Movement Index)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/dmi/) |
| [TEMA (Triple Exponential Moving Average)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/tema/) | [Klinger Oscillator](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/klinger/) |
| [VbP (Volume by Price)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/volume-by-price/) | [Linear Regression Angle](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/linear-regression-angle/) |
| [VWAP (Volume Weighted Average Price)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/vwap/) | [Linear Regression Intercept](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/linear-regression-intercept/) |
| [WMA (Weighted Moving Average)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/wma/) | [Linear Regression Slope](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/linear-regression-slope/)  |
| [Zig Zag](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/zigzag/) | [MACD (Moving Average Convergence Divergence)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/macd/) |
| | [MFI (Money Flow Index)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/mfi/) |
| | [Momentum](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/momentum/) |
| | [NATR (Normalized Average True Range)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/natr/) |
| | [OBV (On-Balance Volume)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/obv/) |
| | [Percentage Price oscillator](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/ppo/) |
| | [RoC (Rate of Change)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/roc/) |
| | [RSI (Relative Strength Index)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/rsi/) |
| | [Slow Stochastic](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/slow-stochastic/) |
| | [Stochastic](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/stochastic/) |
| | [TRIX (Triple exponential average)](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/trix/) |
| | [Williams %R](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/williams-r/) |


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

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/demo/macd-pivot-points) to check the code.

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