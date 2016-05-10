$(function () {
    $('#container').highcharts({
        chart: {
            height: 100,
            marginTop: 40
        },
        title: {
            text: 'Highcharts <= 3.0.9: series disappeared'
        },
        legend: {
            enabled: false
        },
        yAxis: {
            type: 'logarithmic',
            title: {
                text: 'log Y'
            }
        },
        series: [{
            data: [210, 256, 236, 308, 212, 297, 314, 256, 236, 277]
        }]
    });

});