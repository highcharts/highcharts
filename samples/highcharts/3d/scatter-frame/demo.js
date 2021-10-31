// Give the points a 3D feel by adding a radial gradient
Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map((color) => ({
        radialGradient: {
            cx: 0.4,
            cy: 0.3,
            r: 0.5
        },
        stops: [
            [0, color],
            [1, Highcharts.color(color).brighten(-0.2).get('rgb')]
        ]
    }))
});

// Set up the chart
const chart = Highcharts.chart('container', {
    chart: {
        margin: 100,
        type: 'scatter3d',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            axisLabelPosition: 'auto',
            frame: {
                left: {
                    color: 'rgba(0, 0, 100, 0.2)',
                    visible: 'auto'
                },
                right: {
                    color: 'rgba(0, 0, 100, 0.2)',
                    visible: 'auto'
                },
                top: {
                    color: 'rgba(0, 0, 100, 0.2)',
                    visible: 'auto'
                },
                bottom: {
                    color: 'rgba(0, 0, 100, 0.2)',
                    visible: 'auto'
                },
                front: {
                    color: 'rgba(0, 0, 100, 0.2)',
                    visible: 'auto'
                },
                back: {
                    color: 'rgba(0, 0, 100, 0.2)',
                    visible: 'auto'
                }
            }
        }
    },
    title: {
        text: 'Draggable box'
    },
    subtitle: {
        text: 'Click and drag the plot area to rotate in space.<br> Frames will hide and show automatically.'
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
    series: [
        {
            name: 'Reading',
            colorByPoint: true,
            data: [
                [1, 6, 5],
                [8, 7, 9],
                [1, 3, 4],
                [4, 6, 8],
                [5, 7, 7],
                [6, 9, 6],
                [7, 0, 5],
                [2, 3, 3],
                [3, 9, 8],
                [3, 6, 5],
                [4, 9, 4],
                [2, 3, 3],
                [6, 9, 9],
                [0, 7, 0],
                [7, 7, 9],
                [7, 2, 9],
                [0, 6, 2],
                [4, 6, 7],
                [3, 7, 7],
                [0, 1, 7],
                [2, 8, 6],
                [2, 3, 7],
                [6, 4, 8],
                [3, 5, 9],
                [7, 9, 5],
                [3, 1, 7],
                [4, 4, 2],
                [3, 6, 2],
                [3, 1, 6],
                [6, 8, 5],
                [6, 6, 7],
                [4, 1, 1],
                [7, 2, 7],
                [7, 7, 0],
                [8, 8, 9],
                [9, 4, 1],
                [8, 3, 4],
                [9, 8, 9],
                [3, 5, 3],
                [0, 2, 4],
                [6, 0, 2],
                [2, 1, 3],
                [5, 8, 9],
                [2, 1, 1],
                [9, 7, 6],
                [3, 0, 2],
                [9, 9, 0],
                [3, 4, 8],
                [2, 6, 1],
                [8, 9, 2],
                [7, 6, 5],
                [6, 3, 1],
                [9, 3, 1],
                [8, 9, 3],
                [9, 1, 0],
                [3, 8, 7],
                [8, 0, 0],
                [4, 9, 7],
                [8, 6, 2],
                [4, 3, 0],
                [2, 3, 5],
                [9, 1, 4],
                [1, 1, 4],
                [6, 0, 2],
                [6, 1, 6],
                [3, 8, 8],
                [8, 8, 7],
                [5, 5, 0],
                [3, 9, 6],
                [5, 4, 3],
                [6, 8, 3],
                [0, 1, 5],
                [6, 7, 3],
                [8, 3, 2],
                [3, 8, 3],
                [2, 1, 6],
                [4, 6, 7],
                [8, 9, 9],
                [5, 4, 2],
                [6, 1, 3],
                [6, 9, 5],
                [4, 8, 2],
                [9, 7, 4],
                [5, 4, 2],
                [9, 6, 1],
                [2, 7, 3],
                [4, 5, 4],
                [6, 8, 1],
                [3, 4, 0],
                [2, 2, 6],
                [5, 1, 2],
                [9, 9, 7],
                [6, 9, 9],
                [8, 4, 3],
                [4, 1, 7],
                [6, 2, 5],
                [0, 4, 9],
                [3, 5, 9],
                [6, 9, 1],
                [1, 9, 2]
            ]
        }
    ]
});

function start(eStart) {
    eStart = chart.pointer.normalize(eStart);

    const posX = eStart.pageX,
        posY = eStart.pageY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        sensitivity = 5; // lower is more sensitive

    const move = (e) => {
        // Run beta
        const newBeta = beta + (posX - e.pageX) / sensitivity;
        chart.options.chart.options3d.beta = newBeta;

        // Run alpha
        const newAlpha = alpha + (e.pageY - posY) / sensitivity;
        chart.options.chart.options3d.alpha = newAlpha;

        chart.redraw(false);
    };

    const end = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('touchdrag', move);

        document.removeEventListener('mouseup', end);
        document.removeEventListener('touchend', end);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('touchdrag', move);

    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
}

// Add mouse events for rotation
chart.container.addEventListener('mousedown', start);
chart.container.addEventListener('touchstart', start);
