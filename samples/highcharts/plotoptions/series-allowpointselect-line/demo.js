const chart = Highcharts.chart('container', {
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    plotOptions: {
        series: {
            allowPointSelect: true
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ]
    }]
});

document.getElementById('button').addEventListener('click', () => {
    const selectedPoints = chart.getSelectedPoints();

    if (chart.lbl) {
        chart.lbl.destroy();
    }
    chart.lbl = chart.renderer.label(
        'You selected ' + selectedPoints.length + ' points', 100, 60
    )
        .attr({
            padding: 10,
            r: 5,
            fill: Highcharts.getOptions().colors[1],
            zIndex: 5
        })
        .css({
            color: 'white'
        })
        .add();
});
