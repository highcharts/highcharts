jQuery(function () {

    QUnit.test('Spline with connectNulls = true', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'spline'
            },
            plotOptions: {
                series: {
                    connectNulls: true
                }
            },
            series: [{
                name: 'a',
                data: [null, 97.58, 98.45, 96.97, null, 97.63, 99.01, 96.19]
            }, {
                name: 'b',
                data: [null, 92.93, 94.62, 91.25, 91.96, 90.11, 88.67, null]
            }, {
                name: 'c',
                data: [71.01, null, 73.41, 78.32, 67.65, 62.77, 68.35, 65.12]
            }, {
                name: 'd',
                data: [null, 58.9, null, null, null, 55.75, 60.93, null]
            }, {
                name: 'e',
                data: [91.59, 97.25, 96.05, 94.92, 91.08, 89.01, 88.07, 89.86]
            }, {
                name: 'f',
                data: [null, null, 84.62, null, 87.88, null, 89.58, 65.73]
            }, {
                name: 'g',
                data: [null, 93.27, 94.89, null, 85.33, 94.03, 89.65, 92.77]
            }, {
                name: 'h',
                data: [97.47, null, 93.85, null, 45.95, 92.65, 95.18, 91.21]
            }, {
                name: 'i',
                data: [null, null, 95.65, null, 90.47, 92.01, 92.83, 93.74]
            }, {
                name: 'j',
                data: [null, null, 89.2, null, 90.79, 89.94, 84.02, 79.01]
            }]
        });

        chart.series.forEach(function (series) {
            assert.ok(
                series.graph.element.getAttribute('d').length > 50,
                'Has a long and nice graph'
            );
        });
    });
});