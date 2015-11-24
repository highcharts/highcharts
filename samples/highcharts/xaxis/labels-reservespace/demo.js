$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            borderWidth: 1
        },

        title: {
            text: 'No space reserved for X axis labels'
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: false
        },

        xAxis: {
            categories: ['Product 1', 'Product 2', 'Yet another product'],
            labels: {
                rotation: -90,
                align: 'left',
                reserveSpace: false,
                y: -5,
                style: {
                    color: '#FFFFFF',
                    fontSize: '12pt',
                    fontWeight: 'bold',
                    textShadow: '0 0 2px contrast, 0 0 2px contrast'
                }
            },
            tickWidth: 0
        },

        series: [{
            data: [39.9, 71.5, 106.4],
            dataLabels: {
                enabled: true
            }
        }]
    });
});