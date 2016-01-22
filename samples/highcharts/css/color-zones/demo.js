$(function () {
    $('#container').highcharts({
        title: {
            text: 'Styled color zones'
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
                className: 'zone-0'
            }, {
                value: 10,
                className: 'zone-1'
            }, {
                className: 'zone-2'
            }]
        }]
    });
});