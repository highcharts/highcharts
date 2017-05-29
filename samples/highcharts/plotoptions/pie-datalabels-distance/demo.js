
Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Pie data label distance'
    },

    plotOptions: {
        pie: {
            dataLabels: {
                distance: -30
            }
        }
    },

    series: [{
        data: [
            ['Firefox',   44.2],
            ['IE7',       26.6],
            ['IE6',       20],
            {
                name: 'Chrome',
                y: 3.1,
                dataLabels: {
                    distance: 30 // Individual distance
                }
            },
            ['Other',    5.4]
        ]
    }]
});