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
    

See [Combining chart types](combining-chart-types) for more information on how to combine chart types.

For more information on each chart type, see:

*   [Angular gauges](angular-gauges)
*   [Area chart](area-chart)
*   [Areaspline chart](areaspline-chart)
*   [Bar chart](bar-chart)
*   [Box plot series](box-plot-series)
*   [Column chart](column-chart)
*   [Error bar series](error-bar-series)
*   [Funnel series](funnel-series)
*   [Heat map series](heatmap)
*   [Line chart](line-chart)
*   [Pie chart](pie-chart)
*   [Polar chart](polar-chart)
*   [Range series](range-series)
*   [Scatter chart](scatter-chart)
*   [Spline chart](spline-chart)
*   [Treemap](treemap)
*   [Waterfall series](waterfall-series)

Highstock specific charts are:

*   [Candlestick chart](candlestick-chart)
*   [OHLC chart](ohlc-chart)
*   [Flag series](flag-series)
