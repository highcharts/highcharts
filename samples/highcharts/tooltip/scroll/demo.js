const chartOptions = {
    series: [{
        type: 'column',
        data: [42]
    }]
};

Highcharts.chart('container', chartOptions);
Highcharts.chart('container2', chartOptions);