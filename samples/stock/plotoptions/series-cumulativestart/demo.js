const day = 1000 * 60 * 60 * 24;

// Create the chart
Highcharts.stockChart('container', {

    title: {
        text: 'CumulativeStart'
    },

    plotOptions: {
        series: {
            cumulative: true,
            pointStart: Date.UTC(2021, 0, 1),
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
        min: Date.UTC(2021, 0, 2)
    },

    series: [{
        data: [10, 2, 5, 10, 12, 13, 3, 2, 5],
        cumulativeStart: true
    }, {
        data: [10, 2, 5, 10, 12, 13, 3, 2, 5]
    }]
});
