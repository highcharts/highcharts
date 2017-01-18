$(function () {
    var chart = Highcharts.chart('container', {

        title: {
            text: 'Highcharts exporting scale demo'
        },

        subtitle: {
            text: 'This subtitle is HTML',
            useHTML: true
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        exporting: {
            allowHTML: true,
            enabled: false
        }

    });

    $('button.export').click(function () {
        chart.exportChart({
            scale: $(this).data().scale
        });
    });
});
