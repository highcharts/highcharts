const chart = Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    series: [{
        data: [29.9, 71.5, 106.4]
    }]
});

let i = 0;
document.getElementById('button').addEventListener('click', () => {
    chart.series[0].addPoint((50 * (i % 3)) + 10);
    i += 1;
});
