// Generate test data with discrete X values and continuous Y values.
const getTestData = x => {
    const off = 0.2 + 0.2 * Math.random();
    return new Array(200).fill(1).map(() => [
        x,
        off + (Math.random() - 0.5) * (Math.random() - 0.5)
    ]);
};

// Make all the colors semi-transparent so we can see overlapping dots
const colors = Highcharts.getOptions().colors.map(color =>
    Highcharts.color(color).setOpacity(0.5).get()
);

Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },

    colors,

    title: {
        text: 'Scatter chart with jitter'
    },

    xAxis: {
        categories: ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5']
    },

    yAxis: {
        title: {
            text: 'Measurements'
        }
    },

    plotOptions: {
        scatter: {
            showInLegend: false,
            jitter: {
                x: 0.24,
                y: 0
            },
            marker: {
                radius: 2,
                symbol: 'circle'
            },
            tooltip: {
                pointFormat: 'Measurement: {point.y:.3f}'
            }
        }
    },

    series: [{
        name: 'Run 1',
        data: getTestData(0)
    }, {
        name: 'Run 2',
        data: getTestData(1)
    }, {
        name: 'Run 3',
        data: getTestData(2)
    }, {
        name: 'Run 4',
        data: getTestData(3)
    }, {
        name: 'Run 5',
        data: getTestData(4)
    }]
});