$(function () {
    $('#container').highcharts({
        title: {
            text: 'Zones were not applied correctly if they were out of range'
        },
        yAxis: {
            tickPositioner: function () {
                return [-6, -4, -2];
            }
        },
        series: [{
            type: 'spline',
            data: [-4, -3, -2, -3, -2, -4],
            color: '#00F',
            negativeColor: '#F00',
            threshold: 0
        }]
    });
});