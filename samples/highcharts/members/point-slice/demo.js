
var chart = Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    series: [{
        data: [29.9, 71.5, 106.4]
    }]
});

// button handler
$('#button').click(function () {
    chart.series[0].data[0].slice();
});
