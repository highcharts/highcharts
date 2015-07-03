$(function () {
    $('#container').highcharts({
        title: {
            text: 'Filled color zones'
        },
        yAxis: {
            min: -10
        },
        series: [{
            type: 'areaspline',
            threshold: -10,
            data: [-10, -5, 0, 5, 10, 15, 10, 10, 5, 0, -5],
            zones: [{
                value: 0,
                color: '#f7a35c',
                fillColor: '#f15c80'
            }, {
                value: 10,
                color: '#7cb5ec'
            }, {
                color: '#90ed7d'
            }]
        }]
    });
});