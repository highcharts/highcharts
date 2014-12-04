$(function () {
    $('#container').highcharts({
        series: [{
            type: "treemap",
            data: [{
                name: 'A',
                value: 6
            }, {
                name: 'B',
                value: 6
            }, {
                name: 'C',
                value: 4
            }, {
                name: 'D',
                value: 3
            }, {
                name: 'E',
                value: 2
            }, {
                name: 'F',
                value: 2
            }, {
                name: 'G',
                value: 1
            }]
        }],
        title: {
            text: 'Highcharts Treemap'
        }
    });
});