$(function () {

    // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range study'
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(2014, 11, 1),
            max: Date.UTC(2014, 11, 23)
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            // pointPadding: 0,
            // groupPadding: 0,
            borderRadius: 5,
            pointWidth: 10,
            data: [{
                x: Date.UTC(2014, 11, 1),
                x2: Date.UTC(2014, 11, 2),
                partialFill: 0.95,
                y: 0
            }, {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2014, 11, 5),
                partialFill: 0.5,
                y: 1
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                partialFill: 0.15,
                y: 2
            }, {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                partialFill: {
                    amount: 0.3,
                    fill: '#fa0'
                },
                y: 1
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 2
            }]
        }]

    });
});
