const chart = Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    title: {
        text: 'No data in pie chart'
    },
    series: [
        {
            type: 'pie',
            name: 'Random data',
            data: []
        }
    ]
});

document.getElementById('add').addEventListener('click', () => {
    chart.series[0].addPoint(Math.floor(Math.random() * 10 + 1)); // Return random integer between 1 and 10.
});

document.getElementById('remove').addEventListener('click', () => {
    if (chart.series[0].points[0]) {
        chart.series[0].points[0].remove();
    }
});
