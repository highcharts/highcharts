const chart = Highcharts.chart('container', {
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ],
        plotBands: [{
            color: '#FCFFC5',
            from: 4.5,
            to: 7.5,
            id: 'plotband-1'
        }]
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});

document.getElementById('button').addEventListener('click', () => {
    chart.xAxis[0].removePlotBand('plotband-1');
});
