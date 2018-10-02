Highcharts.chart('container', {

    chart: {
        type: 'solidgauge'
    },

    title: {
        text: 'Solidgauge data overflow past full circle (#2997)'
    },

    pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    yAxis: {
        min: -5,
        max: 5
    },

    series: [{
        data: [38]
    }]

});
