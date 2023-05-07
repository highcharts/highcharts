Highcharts.chart('container', {

    chart: {
        type: 'heatmap'
    },

    colorAxis: {
        min: 0
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                nullFormat: 'I am a null point!'
            }
        }
    },

    series: [{
        data: [
            [0, 0, null],
            [0, 1, 2],
            [1, 0, 3],
            [1, 1, null],
            [2, 0, null],
            [2, 1, 4]
        ]
    }],

    title: {
        text: 'nullFormat option in heatmap'
    }

});
