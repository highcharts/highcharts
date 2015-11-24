$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Test for data labels allowOverlap'
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{y} km'
                }
            }
        },

        series: [{
            data: [1, 2, 3, 4, 5, 6],
            name: '1. Click me'
        }, {
            data: [1.1, 2.1, 3.1, 4.1, 5.1, 6.1],
            name: '2. My data labels should show'
        }]

    });

    $('#hide').click(function () {
        $('#container').highcharts().series[0].hide();
    });
});
