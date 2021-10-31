const chart = Highcharts.chart('container', {
    chart: {
        type: 'bubble'
    },
    title: {
        text: 'Size by absolute value'
    },
    subtitle: {
        text: 'Size is computed by absolute value on negative bubbles'
    },
    series: [
        {
            data: [
                [-5, 0, -5],
                [-4, 0, -4],
                [-3, 0, -3],
                [-2, 0, -2],
                [-1, 0, -1],
                [0, 0, 0],
                [1, 0, 1],
                [2, 0, 2],
                [3, 0, 3],
                [4, 0, 4],
                [5, 0, 5]
            ],
            sizeByAbsoluteValue: true,
            negativeColor: '#FF0000'
        }
    ]
});

document.getElementById('zthreshold').addEventListener('input', (e) => {
    chart.series[0].update({
        zThreshold: parseInt(e.target.value, 10)
    });
});
