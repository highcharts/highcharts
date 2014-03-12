$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Points in the same X value should be allowed in the same series'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'John',
            data: [
                [0, 5],
                [0, 6],
                [1, 10]
            ]
        }, {
            name: 'Jane',
            data: [
                [0, 2],
                [1, 2]
            ]
        }]
    });
});