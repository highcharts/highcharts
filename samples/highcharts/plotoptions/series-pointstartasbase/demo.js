Highcharts.chart('container', {

    title: {
        text: 'Point start as base'
    },
    subtitle: {
        text: 'X values are relative to pointStart'
    },
    xAxis: {
        type: 'datetime'
    },

    plotOptions: {
        series: {
            pointStart: Date.UTC(2020, 0, 1),
            pointStartAsBase: true,
            pointIntervalUnit: 'day'
        }
    },

    series: [{
        data: [
            [1, 29.9],
            [2, 71.5],
            [5, 106.4],
            [6, 129.2],
            [7, 144.0],
            [8, 176.0],
            [9, 135.6],
            [12, 48.5],
            [13, 216.4],
            [14, 194.1],
            [15, 95.6],
            [16, 54.4]
        ],
        type: 'column'
    }]
});