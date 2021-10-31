const chart = Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    series: [
        {
            data: [29.9, 71.5, 106.4]
        }
    ]
});

document.getElementById('button').addEventListener('click', () => {
    chart.series[0].setData([129.2, 144.0, 176.0]);
});
