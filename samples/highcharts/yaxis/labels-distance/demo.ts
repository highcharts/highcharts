Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.labels.distance</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        labels: {
            distance: '75%',
            y: 25
        },
        lineWidth: 0,
        max: 100,
        min: 0,
        minorTickWidth: 0,
        tickAmount: 2,
        tickWidth: 0
    },
    pane: {
        background: {
            innerRadius: '50%',
            outerRadius: '100%',
            shape: 'arc'
        },
        center: ['50%', '80%'],
        endAngle: 90,
        size: '130%',
        startAngle: -90
    },
    series: [{
        data: [54.4],
        innerRadius: '50%',
        radius: '100%',
        type: 'solidgauge'
    }]
} satisfies Highcharts.Options);
