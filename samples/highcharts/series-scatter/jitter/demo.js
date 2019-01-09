// Generate test data with discrete X values and continuous Y values.
function getTestData() {
    var data = [];
    for (var x = 0; x < 5; x++) {
        var off = 0.2 + 0.2 * Math.random();
        for (var i = 0; i < 200; i++) {
            data.push([x, off + (Math.random() - 0.5) * (Math.random() - 0.5)]);
        }
    }
    return data;
}

Highcharts.chart('container', {
    title: {
        text: 'Scatter chart with jitter'
    },
    subtitle: {
        text: 'Spread discrete values by randomizing the rendered position'
    },
    xAxis: {
        categories: ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5']
    },
    yAxis: {
        title: {
            text: 'Measurements'
        }
    },
    series: [{
        name: 'Experiments',
        data: getTestData(),
        showInLegend: false,
        type: 'scatter',
        color: 'rgba(100, 100, 255, 0.5)',
        jitter: {
            x: 0.2,
            y: 0
        },
        marker: {
            radius: 2
        }
    }]
});