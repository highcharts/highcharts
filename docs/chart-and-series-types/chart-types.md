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
    

See [Combining chart types](/docs/chart-and-series-types/combining-chart-types) for more information on how to combine chart types.

For more information on each chart type, see:

*   [Angular gauges](/docs/chart-and-series-types/angular-gauges)
*   [Area chart](/docs/chart-and-series-types/area-chart)
*   [Areaspline chart](/docs/chart-and-series-types/areaspline-chart)
*   [Bar chart](/docs/chart-and-series-types/bar-chart)
*   [Box plot series](/docs/chart-and-series-types/box-plot-series)
*   [Column chart](/docs/chart-and-series-types/column-chart)
*   [Error bar series](/docs/chart-and-series-types/error-bar-series)
*   [Funnel series](/docs/chart-and-series-types/funnel-series)
*   [Heat map series](/docs/chart-and-series-types/heatmap)
*   [Line chart](/docs/chart-and-series-types/line-chart)
*   [Pie chart](/docs/chart-and-series-types/pie-chart)
*   [Polar chart](/docs/chart-and-series-types/polar-chart)
*   [Range series](/docs/chart-and-series-types/range-series)
*   [Scatter chart](/docs/chart-and-series-types/scatter-chart)
*   [Spline chart](/docs/chart-and-series-types/spline-chart)
*   [Treemap](/docs/chart-and-series-types/treemap)
*   [Waterfall series](/docs/chart-and-series-types/waterfall-series)

Highstock specific charts are:

*   [Candlestick chart](/docs/chart-and-series-types/candlestick-chart)
*   [OHLC chart](/docs/chart-and-series-types/ohlc-chart)
*   [Flag series](/docs/chart-and-series-types/flag-series)
