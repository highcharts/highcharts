Highcharts.chart('container', {
    chart: {
        type: 'solidgauge'
    },
    title: {
        text: 'Demo of <em>yAxis.minColor</em> and <em>maxColor</em>'
    },
    yAxis: {
        title: {
            y: -70
        },
        labels: {
            distance: '80%',
            y: 20
        },
        lineWidth: 0,
        max: 100,
        maxColor: '#000000',
        min: 0,
        minColor: '#ffffff',
        minorTickInterval: null,
        tickAmount: 2,
        tickWidth: 0
    },
    pane: {
        background: {
            backgroundColor: '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        },
        center: ['50%', '85%'],
        endAngle: 90,
        size: '140%',
        startAngle: -90
    },
    series: [{
        data: [30]
    }]
} satisfies Highcharts.Options);
