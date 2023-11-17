const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }]
});

let hasPlotBand = false;

document.getElementById('button').addEventListener('click', e => {
    if (!hasPlotBand) {
        chart.xAxis[0].addPlotBand({
            from: 5.5,
            to: 7.5,
            color: '#FCFFC5',
            id: 'plot-band-1'
        });
        e.target.innerHTML = 'Remove plot band';
    } else {
        chart.xAxis[0].removePlotBand('plot-band-1');
        e.target.innerHTML = 'Add plot band';
    }
    hasPlotBand = !hasPlotBand;
});
