$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Highcharts <= 3.0.9: minRange and single column caused 1px columns on top of each other'
        },
        xAxis: {
            type: 'datetime',
            minRange: 7 * 24 * 3600 * 1000
        },
        series: [{
            name: 'Series 1',
            data: [
                [Date.UTC(1970, 0, 1), 10   ]
            ]
        }, {
            name: 'Series 2',
            data: [
                [Date.UTC(1970, 0, 1), 20   ]
            ]
        }, {
            name: 'Series 3',
            data: [
                [Date.UTC(1970, 0, 1), 30   ]
            ]
        }]
    });
});

