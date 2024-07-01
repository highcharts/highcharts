// Data retrieved from: https://maxf1.net/en/results/teams/
Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'F1 top constructors by season'
    },
    xAxis: {
        categories: [
            '2023', '2022', '2021', '2020', '2019', '2018'
        ]
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Points'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Red Bull',
        data: [860, 759, 585.5, 319, 417, 419]
    }, {
        name: 'Mercedes',
        data: [409, 554, 613.5, 573, 739, 655]
    }, {
        name: 'Ferrari',
        data: [406, 515, 323.5, 131, 504, 571]
    }]
});
