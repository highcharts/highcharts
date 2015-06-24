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
            text: 'a 3D Scatter Chart'
        },
        subtitle: {
            text: 'with categories on the Z-Axis'
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
            categories: ['Apples', 'Pears', 'Bananas', 'Kiwis'],
            labels: {
                y: 5,
                rotation: 18
            }
        },
        series: [{
            name: 'Fruits',
            data: [
                // [X, Y, Z]
                [1, 1, 1],
                [1, 1, 2],
                [1, 1, 0],
                [2, 3, 2],
                [2, 6, 3],
                [4, 5, 1],
                [4, 2, 2],
                [7, 1, 1],
                [7, 1, 0],
                [8, 1, 2]
            ]
        }]
    });
});