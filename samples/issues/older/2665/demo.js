$(function () {

    $('#container').highcharts({

        chart: {
            polar: true
        },

        title: {
            text: 'Highcharts <= 3.0.9: Wrong tooltip in left hemisphere.'
        },

        pane: {
            startAngle: -90,
            endAngle: 90
        },

        series: [ {
            data: [1, 1, 1, 1, 1, 1, 1]
        }]
    });


});

