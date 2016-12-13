$(function () {
    Highcharts.chart('container', {
        series: [{
            data: [{
                y: 29.9,
                connect: 'bob'
            }, {
                connect: {
                    to: 'johan',
                    type: 'fastAvoid',
                    dashStyle: 'shortdash',
                    lineWidth: 2,
                    color: '#d99',
                    endMarker: {
                        verticalAlign: 'top',
                        align: 'left'
                    }
                },
                y: 71.5
            }, 106.4, 144.0, 176.0, {
                id: 'bob',
                y: 135.6
            }, 148.5, 150, 216.4, 194.1, 95.6, 54.4],
            type: 'scatter'
        }, {
            data: [19.9, 11.5, 16.4, 19.2, 94.0, 12, 15, 16.0, {
                id: 'johan',
                y: 55.6
            }, 18.5, 26.4, 44.4],
            type: 'column'
        }]
    });
});
