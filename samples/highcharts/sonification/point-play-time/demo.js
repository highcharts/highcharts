var chart = Highcharts.chart('container', {
    title: {
        text: 'Time mapping',
        align: 'left',
        margin: 25
    },
    subtitle: {
        text: 'Points are played from bottom of y-axis and up',
        align: 'left'
    },
    chart: {
        type: 'scatter'
    },
    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            mapping: {
                time: 'y' // Time is mapped to Y values
            }
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.x},{point.y}'
    },
    series: [{
        data: [
            [16, -5],
            [7, -4],
            [19, -3],
            [3, -2],
            [21, -1],
            [-2, 0],
            [7, 1],
            [-3, 2],
            [16, 3],
            [17, 4],
            [11, 5],
            [-1, 6]
        ],
        color: 'rgba(30, 30, 200, 0.7)',
        marker: {
            radius: 5
        }
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
