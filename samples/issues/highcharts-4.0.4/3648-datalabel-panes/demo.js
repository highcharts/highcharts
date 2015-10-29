$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column',
            inverted: true
        },

        yAxis: [{
            width: 200,
            lineWidth: 2
        }, {
            left: 250,
            width: 200,
            offset: 0,
            lineWidth: 2
        }],

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    inside: true,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0 0 3px black'
                    },
                    format: '{series.name} - {y}'
                }
            }
        },
        series: [{
            data: [11, 12, 13, 14]
        }, {
            data: [21,22,23,24],
            yAxis: 1
        }]

    });
});
