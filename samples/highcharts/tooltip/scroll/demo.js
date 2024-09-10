const chartOptions = {
        series: [{
            type: 'column',
            data: [42]
        }]
    },
    chart1 = Highcharts.chart('container', chartOptions),
    chart2 = Highcharts.chart('container2', chartOptions);