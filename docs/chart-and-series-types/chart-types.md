Chart types
===========

Highcharts support a range of different chart types so data can be displayed in a meaningful way. Highcharts supports line, spline, area, areaspline, column, bar, pie, scatter, gauge, arearange, areasplinerange and columnrange chart types.

To set a default chart type use:

    
    chart: {
        type: 'line'
    }

Several chart types can also be combined in one chart using the type attribute on series to set different chart types for each series:

    
    series: [{
        type: 'line'
        data: []
    },{
        type: 'column'
        data: []
    }]
    

See [Combining chart types](https://highcharts.com/docs/chart-and-series-types/combining-chart-types) for more information on how to combine chart types.

For more information on each chart type, see:

*   [Angular gauges](https://highcharts.com/docs/chart-and-series-types/angular-gauges)
*   [Area chart](https://highcharts.com/docs/chart-and-series-types/area-chart)
*   [Areaspline chart](https://highcharts.com/docs/chart-and-series-types/areaspline-chart)
*   [Bar chart](https://highcharts.com/docs/chart-and-series-types/bar-chart)
*   [Box plot series](https://highcharts.com/docs/chart-and-series-types/box-plot-series)
*   [Column chart](https://highcharts.com/docs/chart-and-series-types/column-chart)
*   [Error bar series](https://highcharts.com/docs/chart-and-series-types/error-bar-series)
*   [Funnel series](https://highcharts.com/docs/chart-and-series-types/funnel-series)
*   [Heat map series](https://highcharts.com/docs/chart-and-series-types/heatmap)
*   [Line chart](https://highcharts.com/docs/chart-and-series-types/line-chart)
*   [Pie chart](https://highcharts.com/docs/chart-and-series-types/pie-chart)
*   [Polar chart](https://highcharts.com/docs/chart-and-series-types/polar-chart)
*   [Range series](https://highcharts.com/docs/chart-and-series-types/range-series)
*   [Scatter chart](https://highcharts.com/docs/chart-and-series-types/scatter-chart)
*   [Spline chart](https://highcharts.com/docs/chart-and-series-types/spline-chart)
*   [Treemap](https://highcharts.com/docs/chart-and-series-types/treemap)
*   [Waterfall series](https://highcharts.com/docs/chart-and-series-types/waterfall-series)

Highstock specific charts are:

*   [Candlestick chart](https://highcharts.com/docs/chart-and-series-types/candlestick-chart)
*   [OHLC chart](https://highcharts.com/docs/chart-and-series-types/ohlc-chart)
*   [Flag series](https://highcharts.com/docs/chart-and-series-types/flag-series)
