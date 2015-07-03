$(function () {
    $('#container').highcharts({
        series: [{
            data: [-10, -5, 0, 5, 10, 15, 10, 10, 5, 0, -5],
            zones: [{
                value: 0,
                color: '#f7a35c'
            }, {
                value: 10,
                color: '#7cb5ec'
            }, {
                color: '#90ed7d'
            }]
        }]
    });
});