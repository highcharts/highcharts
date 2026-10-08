Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>plotOptions.pie.dataLabels.distance</em>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                distance: '3rem'
            }
        }
    },
    series: [{
        data: [
            [
                'Apples',
                4
            ],
            [
                'Bananas',
                3
            ],
            [
                'Oranges',
                2
            ],
            [
                'Pears',
                1
            ]
        ],
        name: 'Share',
        type: 'pie'
    }]
});
