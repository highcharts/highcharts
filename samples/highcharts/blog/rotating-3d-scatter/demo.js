// Give the points a 3D feel by adding a radial gradient
Highcharts.getOptions().colors = Highcharts.getOptions().colors.map(
    function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, new Highcharts.Color(color).brighten(-0.2).get('rgb')]
            ]
        };
    });
var left = Highcharts.chart('left', {
    chart: {
        renderTo: 'container',
        margin: 100,
        type: 'scatter',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 29,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            frame: {
                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
            }
        }
    },
    title: {
        text: 'Stereographic 3D scatter'
    },
    plotOptions: {
        scatter: {
            width: 10,
            height: 10,
            depth: 10
        }
    },
    yAxis: {
        min: 0,
        max: 10,
        title: null
    },
    xAxis: {
        min: 0,
        max: 10,
        gridLineWidth: 1
    },
    zAxis: {
        min: 0,
        max: 10,
        showFirstLabel: false
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Reading',
        colorByPoint: true,
        data: returnData(),
        marker: {
            radius: 2
        }
    }]
});

var right = Highcharts.chart('right', {
    chart: {
        renderTo: 'container',
        margin: 100,
        type: 'scatter',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 31,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            frame: {
                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
            }
        }
    },
    title: {
        text: 'Stereographic 3D scatter'
    },
    plotOptions: {
        scatter: {
            width: 10,
            height: 10,
            depth: 10
        }
    },
    yAxis: {
        min: 0,
        max: 10,
        title: null
    },
    xAxis: {
        min: 0,
        max: 10,
        gridLineWidth: 1
    },
    zAxis: {
        min: 0,
        max: 10,
        showFirstLabel: false
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Reading',
        colorByPoint: true,
        data: returnData(),
        marker: {
            radius: 2
        }
    }]
});


setInterval(function () {
    left.options.chart.options3d.beta = left.options.chart.options3d.beta + 1;
    right.options.chart.options3d.beta = left.options.chart.options3d.beta + 2;

    left.redraw();
    right.redraw();
}, 200);

function returnData() {
    return [[1, 6, 5], [8, 7, 9], [1, 3, 4], [4, 6, 8], [5, 7, 7],
        [6, 9, 6], [7, 0, 5], [2, 3, 3], [3, 9, 8], [3, 6, 5], [4, 9, 4],
        [2, 3, 3], [6, 9, 9], [0, 7, 0], [7, 7, 9], [7, 2, 9], [0, 6, 2],
        [4, 6, 7], [3, 7, 7], [0, 1, 7], [2, 8, 6], [2, 3, 7], [6, 4, 8],
        [3, 5, 9], [7, 9, 5], [3, 1, 7], [4, 4, 2], [3, 6, 2], [3, 1, 6],
        [6, 8, 5], [6, 6, 7], [4, 1, 1], [7, 2, 7], [7, 7, 0], [8, 8, 9],
        [9, 4, 1], [8, 3, 4], [9, 8, 9], [3, 5, 3], [0, 2, 4], [6, 0, 2],
        [2, 1, 3], [5, 8, 9], [2, 1, 1], [9, 7, 6], [3, 0, 2], [9, 9, 0],
        [3, 4, 8], [2, 6, 1], [8, 9, 2], [7, 6, 5], [6, 3, 1],
        [9, 3, 1], [8, 9, 3], [9, 1, 0], [3, 8, 7], [8, 0, 0],
        [4, 9, 7], [8, 6, 2], [4, 3, 0], [2, 3, 5], [9, 1, 4],
        [1, 1, 4], [6, 0, 2], [6, 1, 6], [3, 8, 8], [8, 8, 7],
        [5, 5, 0], [3, 9, 6], [5, 4, 3], [6, 8, 3], [0, 1, 5],
        [6, 7, 3], [8, 3, 2], [3, 8, 3], [2, 1, 6], [4, 6, 7],
        [8, 9, 9], [5, 4, 2], [6, 1, 3], [6, 9, 5], [4, 8, 2],
        [9, 7, 4], [5, 4, 2], [9, 6, 1], [2, 7, 3], [4, 5, 4],
        [6, 8, 1], [3, 4, 0], [2, 2, 6], [5, 1, 2], [9, 9, 7],
        [6, 9, 9], [8, 4, 3], [4, 1, 7], [6, 2, 5], [0, 4, 9],
        [3, 5, 9], [6, 9, 1], [1, 9, 2]];
}