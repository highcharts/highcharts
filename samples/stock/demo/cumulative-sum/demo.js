// Create the chart
Highcharts.stockChart('container', {

    title: {
        text: 'Cumulative Sum',
        align: 'left'
    },

    subtitle: {
        text: 'Displays the sum of all the previous values and the current value (only within visible range)',
        align: 'left'
    },

    plotOptions: {
        series: {
            cumulative: true,
            pointStart: Date.UTC(2023, 0, 1),
            pointIntervalUnit: 'day'
        }
    },

    rangeSelector: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> (${point.cumulativeSum})<br/>',
        changeDecimals: 2,
        valueDecimals: 2,
        valuePrefix: '$',
        valueSuffix: ' USD'
    },

    xAxis: {
        minRange: 3 * 24 * 36e5,
        max: Date.UTC(2023, 0, 6)
    },

    series: [{
        name: 'The Local Bakery',
        data: [678.78, 545.33, 788.72, 406.2, 744.87, 466.03, 822.7, 337.52, 396.67, 470.89]
    }, {
        name: 'The Local Fishmarket',
        data: [1340.72, 982.43, 1437.99, 1476.2, 670.23, 429.58, 897.52, 845.11, 1275.79, 1843.01]
    }]
});
