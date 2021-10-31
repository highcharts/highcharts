# Chart types

Highcharts support a range of different chart types so data can be displayed in a meaningful way. Highcharts supports a long list of different chart types, among others `line`, `spline`, `area`, `areaspline`, `column`, `bar`, `pie`, `scatter`, `gauge`, `arearange`, `areasplinerange` and `columnrange`. For the full list of available chart types, see the API for [Highcharts](https://api.highcharts.com/highcharts/plotOptions), [Highcharts Stock](https://api.highcharts.com/highstock/plotOptions), [Highcharts Maps](https://api.highcharts.com/highmaps/plotOptions) and [Highcharts Gantt](https://api.highcharts.com/gantt/plotOptions) respectively.

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

For more information on each chart type, see the left menu.
