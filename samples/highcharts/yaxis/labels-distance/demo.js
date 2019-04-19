Highcharts.chart('container', {

    pane: {
        center: ['50%', '80%'],
        size: '130%',
        startAngle: -90,
        endAngle: 90,
        background: {
            innerRadius: '50%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickWidth: 0,
        minorTickWidth: 0,
        tickAmount: 2,
        labels: {
            distance: '75%',
            y: 25
        }
    },

    series: [{
        type: 'solidgauge',
        innerRadius: '50%',
        radius: '100%',
        data: [54.4]
    }]

});