$(function () {
    $('#container').highcharts({

        title: {
            text: 'Highcharts sourceWidth and sourceHeight demo'
        },

        subtitle: {
            text: 'The on-screen chart is 600x400.<br/>The exported chart is 800x400<br/>(sourceWidth and sourceHeight multiplied by scale)',
            floating: true,
            align: 'left',
            x: 60,
            y: 50
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        exporting: {
            sourceWidth: 400,
            sourceHeight: 200,
            // scale: 2 (default)
            chartOptions: {
                subtitle: null
            }
        }

    });
});