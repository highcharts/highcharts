const day = 1000 * 60 * 60 * 24;

// Create the chart
Highcharts.stockChart('container', {

    title: {
        text: 'CumulativeStart'
    },

    plotOptions: {
        series: {
            cumulative: true,
            pointStart: '2021-01-01',
            pointInterval: day
        }
    },

    rangeSelector: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>' +
            ': <b>{point.y}</b> ({point.cumulativeSum})<br/>',
        changeDecimals: 2,
        valueDecimals: 2
    },

    xAxis: {
        minRange: day * 3,
        min: '2021-01-02'
    },

    series: [{
        data: [10, 2, 5, 10, 12, 13, 3, 2, 5],
        cumulativeStart: true
    }, {
        data: [10, 2, 5, 10, 12, 13, 3, 2, 5]
    }]
});
