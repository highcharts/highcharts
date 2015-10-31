$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            data: [
                [Date.UTC(1971, 0, 1), 10]
            ]
        }, {
            data: [
                [Date.UTC(1971, 0, 1), 10]
            ]
        }, {
            data: [
                [Date.UTC(1971, 0, 1), 10]
            ]
        }]
    });
});