$(function () {
    Highcharts.chart('container', {
        series: [{
            data: [{
                y: 29.9,
                connect: 'bob'
            }, {
                connect: {
                    to: 'bob'
                },
                y: 71.5
            }, 106.4, 129.2, 144.0, 176.0, {
                id: 'bob',
                y: 135.6
            }, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'scatter'
        }]
    });
});
