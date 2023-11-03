const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }]
});

let hasPlotLine = false;

document.getElementById('button').addEventListener('click', e => {
    if (!hasPlotLine) {
        chart.xAxis[0].addPlotLine({
            value: 5.5,
            color: 'red',
            width: 2,
            id: 'plot-line-1'
        });
        e.target.innerHTML = 'Remove plot line';
    } else {
        chart.xAxis[0].removePlotLine('plot-line-1');
        e.target.innerHTML = 'Add plot line';
    }
    hasPlotLine = !hasPlotLine;
});
