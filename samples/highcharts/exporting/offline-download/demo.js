$(function () {

    $('#container').highcharts({

        exporting: {
            chartOptions: {
                chart: {
                    backgroundColor: 'red'
                }
            },
            scale: 3,
            sourceWidth: 1100,
            fallbackToExportServer: false
        },

        title: {
            text: 'Offline export'
        },

        subtitle: {
            text: 'Click the button to download as PNG'
        },

        chart: {
            type: 'area'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, {y: 176.0/**/, marker: { symbol: 'url(http://upload.wikimedia.org/wikipedia/en/7/70/Example.png)'}/**/}, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4/*,{y: 126.0, marker: { symbol: 'url(http://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg)'}}*/]
        }]

    });

});
