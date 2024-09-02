Highcharts.chart('container', {

    title: {
        text: 'Legend symbol color'
    },

    series: [
        {
            data: [1, 5, 2, 6],
            legendColor: '#ff0000'
        },
        {
            data: [4, 2, 2, 1]
        },
        {
            type: 'pie',
            data: [
                {
                    name: 'Point 1',
                    y: 20,
                    legendColor: '#ff0000'
                }, {
                    name: 'Point 2',
                    y: 20
                }
            ],
            center: ['10%', '20%'],
            size: 60,
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    ]
});