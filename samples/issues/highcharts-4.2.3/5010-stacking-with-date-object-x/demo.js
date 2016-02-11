jQuery(function () {

    QUnit.test('Date objects as X values, stack', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            xAxis: {
                type: "datetime",
                minPadding: 0,
                maxPadding: 0
            },
            series: [{
                data: [{
                    x: new Date(2000, 0, 1, 0, 0, 0, 0),
                    y: 100
                }, {
                    x: new Date(2000, 0, 2, 0, 0, 0, 0),
                    y: 105
                }],
                name: "Blue Count"
            }, {
                data: [{
                    x: new Date(2000, 0, 1, 0, 0, 0, 0),
                    y: 24
                }, {
                    x: new Date(2000, 0, 2, 0, 0, 0, 0),
                    y: 21
                }],
                name: "Black Count"
            }]
        });

        assert.ok(
            chart.series[0].area.element.getAttribute('d').indexOf('L') > -1,
            'Area created'
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            (new Date(2000, 0, 2, 0, 0, 0, 0)).getTime(),
            'Area created'
        );
    });

    QUnit.test('Date objects as X values, non-stacked', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            xAxis: {
                type: "datetime",
                minPadding: 0,
                maxPadding: 0
            },
            series: [{
                data: [{
                    x: new Date(2000, 0, 1, 0, 0, 0, 0),
                    y: 100
                }, {
                    x: new Date(2000, 0, 2, 0, 0, 0, 0),
                    y: 105
                }],
                name: "Blue Count"
            }, {
                data: [{
                    x: new Date(2000, 0, 1, 0, 0, 0, 0),
                    y: 24
                }, {
                    x: new Date(2000, 0, 2, 0, 0, 0, 0),
                    y: 21
                }],
                name: "Black Count"
            }]
        });

        assert.ok(
            chart.series[0].area.element.getAttribute('d').indexOf('L') > -1,
            'Area created'
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            (new Date(2000, 0, 2, 0, 0, 0, 0)).getTime(),
            'Area created'
        );
    });

    QUnit.test('Date objects as X values, column', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                type: "datetime",
                minPadding: 0,
                maxPadding: 0
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                data: [{
                    x: new Date(2000, 0, 1, 0, 0, 0, 0),
                    y: 100
                }, {
                    x: new Date(2000, 0, 2, 0, 0, 0, 0),
                    y: 105
                }],
                name: "Blue Count"
            }, {
                data: [{
                    x: new Date(2000, 0, 1, 0, 0, 0, 0),
                    y: 24
                }, {
                    x: new Date(2000, 0, 2, 0, 0, 0, 0),
                    y: 21
                }],
                name: "Black Count"
            }]
        });

        assert.ok(
            parseInt(chart.series[0].points[0].graphic.element.getAttribute('width'), 10) > 10,
            'Column created'
        );
    });
});