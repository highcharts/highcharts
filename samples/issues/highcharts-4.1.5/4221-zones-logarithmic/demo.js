$(function () {
    $('#container').highcharts({

        chart: {
            alignTicks: false
        },

        title: {
            text: 'Zones on log axis failed'
        },

        yAxis: [{
            type: 'logarithmic'
        }, {
            type: 'logarithmic',
            opposite: true
        }],

        plotOptions: {
            series: {
                lineWidth: 10
            }
        },

        series: [{
            data: [1,2,3],
            negativeColor: 'green',
            yAxis: 0
        }, {
            data: [3,2,1],
            negativeColor: 'green',
            threshold: 2,
            yAxis: 1
        }]

    });

});