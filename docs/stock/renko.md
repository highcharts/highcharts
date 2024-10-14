# Highcharts: Understanding Renko Series

Highcharts offers a variety of charting methods for visualizing price data, and one of these is the `Renko` series.

Renko, a Japanese term that signifies "brick", is a charting method commonly used for technical securities trading. The unique aspect of Renko charts is that they do not factor in time. Instead, they solely focus on price changes that meet a predetermined amount, filling a "price box".

## Setting Up a Highcharts Renko Series

Implementing a Renko series in Highcharts requires the `highstock.js` package together with importing the renko module through the `/modules/renko.js`. Here is the basic structure of Highcharts Renko Series:

```javascript
Highcharts.stockChart('container', {
    chart: {
        type: 'renko'
    },

    series: [{
        name: 'Price data',
        data: ...  // Array of price data
    }]
});
```

You can customize your Renko series using the `plotOptions.renko` object. One of the primary parameters to adjust is the `boxSize`, which sets the size of the price boxes.

```javascript
plotOptions: {
    renko: {
        boxSize: 1   // This signifies that each "brick" represents $1 price changes
    }
}
```
Time is not a factor in Renko charts but Highcharts allows you to use a `datetime` axis to indicate a timeline for your price changes, offering a temporal perspective.

## Highcharts Navigator Series

By default, for a brief overview of the price data, smaller Renko chart is beneath the main chart using the `navigator` feature:

```javascript
navigator: {
    series: {
        type: 'renko'
    }
}
```
## Renko vs. Candlestick and Heikin-Ashi

Highcharts supports multiple charting styles, including Candlestick and Heikin-Ashi. While these charting methods are optimal for detailed view of prices within each period (opening, closing, high, low prices), Renko offers a unique advantage in its simplicity. It abstracts minor fluctuations to highlight significant price changes.

In a Candlestick chart, each candle represents a specific timeframe and shows the opening, closing, high and low levels for that period. On the other hand, Renko focuses solely on price movement. A new brick is plotted only when the price changes by a predetermined amount in either direction.

The Heikin-Ashi technique differs from Candlestick and Renko methods by using the average prices to provide smoother trend lines, which might be more useful in catching longer-term trends. 

Even though Renko charts simplify the representation, they can simplify trend identification as compared with the other two types.


<iframe src="https://www.highcharts.com/samples/stock/demo/renko-vs-heikinashi-vs-candlestick/" width="100%" height="100%" title="Renko Chart"></iframe>

## Data Grouping and Tooltip Customization

Highcharts optimizes viewer experience with large datasets by providing data grouping options. However, the `dataGrouping` is disabled for renko series, because it does not make sense to group those points by a unit of time.

Moreover, you can provide detailed insights about each data point using customizable tooltips:

```javascript
tooltip: {
    pointFormat: '<span> style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}<br/>'
}
```
## Summary

Highcharts' Renko series provides a distinct way of visualizing price data. It emphasized considerable price changes over a specified amount, disregarding time and minor fluctuations. This makes it a valuable tool for traders seeking to identify significant market trends, and it is but one of many useful charting techniques supported by Highcharts.

