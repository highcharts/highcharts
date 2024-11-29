Point and Figure chart
================


A Point and Figure (P&F) chart is a technical analysis tool used in financial markets to track price movements without too much focus on the time. It uses a series of Xs and Os to represent upward and downward price movements, respectively. The Xs indicate price increases, while the Os indicate price decreases. Each symbol is added to the column only when the `boxSize` threshold is crossed. A new column is created only when there is a reversal in the price trend of a predefined amount, known as the `reversalAmount`. This approach filters out minor price fluctuations, focusing only on significant price changes, which helps identify trends, support, and resistance levels. Point and Figure charts are particularly useful for spotting breakouts, trends, and potential entry or exit points in the market.

<iframe style="width: 100%; height: 1050px; border: none;" src=https://www.highcharts.com/samples/embed/stock/pointandfigure/pointandfigure-interactive allow="fullscreen"></iframe>


### Data

Point and Figure series accepts the data only in `[x, close]` or `{x, close}` format, which then gets calculated internally to `[{ x, [y], marker }]` groups with unique x values for each array element, which creates up and down trend columns. After that, the groups are parsed into Highcharts data format of `[{ x, y, marker }]`, where for each `y` value in the group column, a new point is created, to create individual points in Point and Figure columns.

### Options specific to the P&F series
In addition to inherited series options, the following options control how the P&F series works:
- new `cross` symbol,
- [`boxSize`](https://api.highcharts.com/highstock/plotOptions.pointandfigure.boxSize) API option,
- [`reversalAmount`](https://api.highcharts.com/highstock/plotOptions.pointandfigure.reversalAmount) API option,
- separate API options for [`marker`](https://api.highcharts.com/highstock/plotOptions.pointandfigure.marker) and [`markerUp`](https://api.highcharts.com/highstock/plotOptions.pointandfigure.markerUp)



For more information on the Point and Figure chart, see the [API reference](https://api.highcharts.com/highstock/plotOptions.pointandfigure), and the [official demo](https://www.highcharts.com/samples/embed/stock/demo/pointandfigure).
