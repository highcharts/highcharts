const day = 1000 * 60 * 60 * 24;

// Create the chart
Highcharts.stockChart('container', {

    title: {
        text: 'Cumulative Sum'
    },

    subtitle: {
        text: 'Displays the sum of all the previous values and the current value (only within visible range)'
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
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.cumulativeSum})<br/>',
        changeDecimals: 2,
        valueDecimals: 2
    },

    xAxis: {
        minRange: day * 3,
        max: Date.UTC(2021, 0, 6)
    },

    series: [{
        data: [1, 2, 5, 10, 20, 50, 100, -100, 100, -100]
    }, {
        data: [100, -50, -15, 15, -50, -20, -30, 100, -100, 100]
    }]
});