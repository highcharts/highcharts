$(function () {
    $('#container').highcharts({

        chart: {
            marginRight: 50
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    style: {
                        fontWeight: 'bold'
                    },
                    x: 3,
                    verticalAlign: 'middle',
                    overflow: true,
                    crop: false
                },
                y: 54.4
            }]
        }]

    });
});