$(function () {
    $('#container').highcharts({
        title: {
            text: 'Tooltip header should display year'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            name: 'Tokyo',
            data: [[1325376000000,49.9], [1356998400000,71.5]]
        }]
    });
});

