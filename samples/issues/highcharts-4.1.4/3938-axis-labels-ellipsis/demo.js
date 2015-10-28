$(function () {
    $('#container').highcharts({

        chart: {
            width: 300,
            height: 300
        },

        title: {
            text: 'Auto rotated X axis labels'
        },

        subtitle: {
            text: 'Should adapt to new wider space'
        },

        xAxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'],
            labels: {
                autoRotation:[0]
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    $('#setsize').click(function () {
        $('#container').highcharts().setSize(500, 300, false);
    });

});