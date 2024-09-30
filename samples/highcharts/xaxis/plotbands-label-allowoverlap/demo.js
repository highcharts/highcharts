Highcharts.chart('container', {
    title: {
        text: 'Plotband labels overlapping'
    },

    xAxis: {
        plotBands: [{
            color: 'cyan',
            from: 1,
            to: 3,
            label: {
                text: 'This label is overlapping with another one',
                allowOverlap: true
            }
        }, {
            color: 'lime',
            from: 2,
            to: 4,
            label: {
                text: 'This label is overlapping with another one'
            }
        }]
    },
    series: [{
        data: [0, 1, 2, 3, 4, 5]
    }]
});