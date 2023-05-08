const chart = Highcharts.chart('container', {
    title: {
        text: 'No data in line chart - with custom options'
    },
    series: [{
        type: 'line',
        name: 'Random data',
        data: []
    }],
    lang: {
        noData: 'Nichts zu anzeigen'
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
});

document.getElementById('add').addEventListener('click', () => {
    chart.series[0].addPoint(Math.floor(Math.random() * 10 + 1)); // Return random integer between 1 and 10.
});

document.getElementById('remove').addEventListener('click', () => {
    if (chart.series[0].points[0]) {
        chart.series[0].points[0].remove();
    }
});

document.getElementById('showCustom').addEventListener('click', () => {
    if (!chart.hasData()) {
        chart.hideNoData();
        chart.showNoData('Your custom error message');
    }
});
