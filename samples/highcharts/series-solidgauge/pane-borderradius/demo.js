Highcharts.chart('container', {

    chart: {
        type: 'solidgauge'
    },

    title: {
        text: 'Solid gauge and pane border radius'
    },

    pane: {
        startAngle: -90,
        endAngle: 90,
        borderRadius: '50%',
        size: '120%',
        innerSize: '80%',
        center: ['50%', '75%']
    },

    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickWidth: 0,
        minorTickWidth: 0,
        labels: {
            enabled: false
        }
    },

    series: [{
        data: [38],
        dataLabels: {
            borderWidth: 0,
            style: {
                fontSize: '3em'
            },
            format: '{y}%',
            verticalAlign: 'bottom'
        },
        enableMouseTracking: false
    }]

});
