[
    // chart.inverted, xAxis.reversed, yAxis.reversed, zoneAxis = x
    [false, false, false, false],
    [true, false, false, false],
    [false, true, false, false],
    [false, false, true, false],
    [false, false, false, true],
    [true, true, false, false],
    [true, false, true, false],
    [true, false, false, true],
    [true, true, true, false],
    [true, true, false, true],
    [true, true, true, true],
    [false, true, true, true],
    [true, false, true, true],
    [true, true, false, true],
    [true, true, true, false],
    [false, false, true, true],
    [false, true, false, true],
    [false, false, true, true]
].forEach((options, i) => {

    if (i !== 7) {
        // return;
    }

    const container = document.createElement('div');
    container.style.width = '300px';
    container.style.height = '300px';
    container.style.cssFloat = 'left';
    container.style.border = '1px solid silver';
    document.getElementById('container').appendChild(container);

    Highcharts.chart(container, {
        chart: {
            inverted: options[0]
        },
        accessibility: {
            enabled: false
        },
        title: {
            text:
                `${i}) chart.inverted: ${options[0]}, ` +
                `xAxis.reversed: ${options[1]}, ` +
                `yAxis.reversed: ${options[2]}, ` +
                `zoneAxis = ${options[3] ? 'x' : 'y'}`,
            align: 'left'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            reversed: options[1]
        },
        yAxis: {
            title: null,
            reversed: options[2]
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                zoneAxis: options[3] ? 'x' : 'y'
            }
        },
        _series: [{
            data: [-1, -1, 100, 1, 1, -50, -1, -1],
            pointStart: -3,

            // data: [100, 100, -10, -10, 100, 100, 100],
            // data: [1, -1, -1, -2, 0, 1, -1, -0.022, -0.01, 1, 2, 1],
            // data: new Array(100).fill(0).map(() => Math.random() - 0.5),
            // type: 'area',
            lineWidth: 10,
            color: 'lightgreen',
            negativeColor: 'red'
            // dashStyle: 'Dash'
        }],

        // Area with zone
        series: [{
            data: [1, 2, 0.5, 3, 1, 0.1, 3, 1],
            type: 'area',
            lineWidth: 5,
            color: 'lightgreen',
            zones: [{
                value: 1,
                color: 'red'
            }]
            // dashStyle: 'Dash'
        }],

        // Multiple zones
        series2: [{
            data: [1, 2, 0.5, 3, 1, 0.1, 3, 1],
            lineWidth: 5,
            color: 'lightgreen',
            zones: [{
                value: 1,
                color: 'red'
            }, {
                value: 2,
                color: 'blue'
            }]
            // dashStyle: 'Dash'
        }]
    });
});