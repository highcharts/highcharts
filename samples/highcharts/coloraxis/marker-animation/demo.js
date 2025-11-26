let dataSet = 0;

const dataSets = [
    [
        [0, 0, 5], [0, 1, 3], [1, 0, 4], [1, 1, 7],
        [2, 0, 2], [2, 1, 8], [3, 0, 6], [3, 1, 1]
    ],
    [
        [0, 0, 1], [0, 1, 9], [1, 0, 6], [1, 1, 2],
        [2, 0, 10], [2, 1, 4], [3, 0, 3], [3, 1, 7]
    ],
    [
        [0, 0, 8], [0, 1, 5], [1, 0, 3], [1, 1, 9],
        [2, 0, 1], [2, 1, 6], [3, 0, 10], [3, 1, 2]
    ]
];

const chart = Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },
    title: {
        text: 'ColorAxis Marker Animation'
    },
    subtitle: {
        text: 'Click the button to update data and see the marker animate'
    },
    xAxis: {
        categories: ['A', 'B', 'C', 'D']
    },
    yAxis: {
        categories: ['Row 1', 'Row 2'],
        title: null
    },
    colorAxis: {
        min: 0,
        max: 10,
        marker: {
            animation: {
                duration: 1000
            },
            color: 'red',
            width: 4
        }
    },
    legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Values',
        data: dataSets[0],
        borderWidth: 1,
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }]
});

document.getElementById('update').addEventListener('click', () => {
    dataSet = (dataSet + 1) % dataSets.length;
    chart.series[0].setData(dataSets[dataSet]);
});
