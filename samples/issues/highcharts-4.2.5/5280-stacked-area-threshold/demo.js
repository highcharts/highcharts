jQuery(function () {

    function checkY(chart, assert) {

        assert.strictEqual(
            typeof chart.series[0].points[2].graphic.attr('y'),
            'number',
            'Valid placement'
        );
        assert.strictEqual(
            chart.series[0].points[2].graphic.attr('y'),
            chart.series[1].points[2].graphic.attr('y'),
            'Same place'
        );
    }

    QUnit.test('Positive', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: -10
                }
            },
            series: [{
                data: [1, 1, 0, 1, 1]
            }, {
                data: [1, 1, 0, 1, 1]
            }]
        });

        checkY(chart, assert);
    });

    QUnit.test('Negative', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: 10
                }
            },
            series: [{
                data: [-1, -1, 0, -1, -1]
            }, {
                data: [-1, -1, 0, -1, -1]
            }]
        });

        checkY(chart, assert);
    });

    QUnit.test('Reversed', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: -10
                }
            },
            yAxis: {
                reversed: true
            },
            series: [{
                data: [1, 1, 0, 1, 1]
            }, {
                data: [1, 1, 0, 1, 1]
            }]
        });

        checkY(chart, assert);
    });

    QUnit.test('Un-reversed stacks', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    threshold: -10
                }
            },
            yAxis: {
                reversedStacks: false
            },
            series: [{
                data: [1, 1, 0, 1, 1]
            }, {
                data: [1, 1, 0, 1, 1]
            }]
        });

        checkY(chart, assert);
    });

});