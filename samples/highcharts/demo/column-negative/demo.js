Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Column chart with negative values'
    },
    xAxis: {
        categories: ['2021', '2022', '2023', '2024', '2025']
    },
    yAxis: {
        title: {
            text: 'Budget surplus'
        }
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        column: {
            borderRadius: '25%'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '{point.y}k$<br/>'
    },
    series: [{
        name: 'New York branch',
        data: [47, 32, -30, -21, 18]
    }, {
        name: 'Chicaco branch',
        data: [33, 32, 35, 11, 4]
    }, {
        name: 'Scranton Branch',
        data: [53, -92, 43, 22, 51]
    }]
});