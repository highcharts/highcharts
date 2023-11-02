const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'spline'
    }, {
        data: [null, 14, 13, 15],
        type: 'spline'
    }, {
        type: 'scatter',
        dataLabels: {
            enabled: true,
            format: 'Nice text around the shape',
            textPath: {
                enabled: true
            }
        },
        marker: {
            radius: 40,
            symbol: 'circle'
        },
        data: [15]
    }]
});


chart.renderer
    .text('text(): The quick brown fox jumps over the lazy dog', 0, 0)
    .setTextPath(chart.series[0].graph, {
        enabled: true,
        attributes: {
            dy: 15
        }
    })
    .add(chart.series[0].group);

chart.renderer
    .label('label(): The quick brown fox jumps over the lazy dog', 10, 20)
    .setTextPath(chart.series[0].graph, {
        enabled: true
    })
    .add(chart.series[0].group);

chart.renderer
    .label('label(): The quick brown fox jumps over the lazy dog')
    .setTextPath(chart.series[1].graph, {
        enabled: true,
        attributes: {
            textAnchor: 'left',
            startOffset: 0
        }
    })
    .add(chart.series[1].group);

chart.renderer
    .text('text(): The quick brown fox jumps over the lazy dog')
    .setTextPath(chart.series[1].graph, {
        enabled: true,
        attributes: {
            textAnchor: 'left',
            startOffset: 0,
            dy: 15
        }
    })
    .add(chart.series[1].group);
