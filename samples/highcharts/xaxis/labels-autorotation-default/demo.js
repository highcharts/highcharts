
var chart = Highcharts.chart('container', {

    title: {
        text: 'Auto rotated X axis labels'
    },

    subtitle: {
        text: 'Drag slider to change the chart width'
    },

    xAxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});

$('#width').on('input', function () {
    chart.setSize(this.value, 400, false);
});
