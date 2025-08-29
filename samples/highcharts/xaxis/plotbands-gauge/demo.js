Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Gauge with plot band'
    },

    pane: {
        startAngle: -150,
        endAngle: 150
    },

    yAxis: {
        min: 0,
        max: 100,
        plotBands: [{
            from: 0,
            to: 60,
            color: '#89A54E'
        }]
    },

    series: [{
        data: [80]
    }]
});