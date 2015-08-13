$(function () {
    $('#container').highcharts({
        chart: {
            margin: [150, 75, 100, 75],
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 20,
                beta: 30,
                depth: 200,
                viewDistance: 5,
                frame: {
                    bottom: {
                        size: 1,
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            }
        },
        title: {
            text: 'A 3D Scatter Chart'
        },
        subtitle: {
            text: 'With grid lines and tick marks on the Z-Axis'
        },
        yAxis: {
            min: 0,
            max: 10
        },
        xAxis: {
            min: 0,
            max: 10,
            gridLineWidth: 1
        },
        zAxis: {
            startOnTick: false,
            tickInterval: 2,
            tickLength: 4,
            tickWidth: 1,
            gridLineColor: '#A00000',
            gridLineDashStyle: 'dot'
        },
        series: [{
            data: [
                // [X, Y, Z]
                [1, 1, 1],
                [1, 1, 2],
                [1, 1, 5],
                [2, 3, 2],
                [2, 6, 4],
                [4, 5, 7],
                [4, 2, 8],
                [7, 1, 3],
                [7, 1, 5],
                [8, 1, 5]
            ]
        }]
    });
});