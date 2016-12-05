$(function () {

    QUnit.test('Bottom -90', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            series: [{
                data: [100, 200],
                dataLabels: {
                    enabled: true,
                    defer: false,
                    inside: true,
                    verticalAlign: 'bottom',
                    align: 'left',
                    rotation: -90
                },
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
            'Labels are visible'
        );
        assert.strictEqual(
            Math.round(chart.series[0].points[0].dataLabel.element.getBoundingClientRect().bottom),
            Math.round(chart.series[0].points[1].dataLabel.element.getBoundingClientRect().bottom),
            'Labels are equally bottom aligned'
        );

    });

    QUnit.test('Top -90', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            series: [{
                data: [100, 200],
                dataLabels: {
                    enabled: true,
                    defer: false,
                    inside: true,
                    verticalAlign: 'top',
                    align: 'right',
                    rotation: -90
                },
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
            'Labels are visible'
        );
        assert.ok(
            Math.abs(
                chart.series[0].points[0].dataLabel.element.getBoundingClientRect().top -
                chart.series[0].points[0].graphic.element.getBoundingClientRect().top
            ) < 12,
            'Label is top aligned to element'
        );
        assert.ok(
            Math.abs(
                chart.series[0].points[1].dataLabel.element.getBoundingClientRect().top -
                chart.series[0].points[1].graphic.element.getBoundingClientRect().top
            ) < 12,
            'Label is top aligned to element'
        );

    });

    QUnit.test('Bottom 90', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            series: [{
                data: [100, 200],
                dataLabels: {
                    enabled: true,
                    defer: false,
                    inside: true,
                    verticalAlign: 'bottom',
                    align: 'right',
                    rotation: 90
                },
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
            'Labels are visible'
        );
        assert.ok(
            Math.abs(
                chart.series[0].points[0].dataLabel.element.getBoundingClientRect().bottom -
                chart.series[0].points[1].dataLabel.element.getBoundingClientRect().bottom
            ) < 12,
            'Labels are equally bottom aligned'
        );

    });

    QUnit.test('Top 90', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            series: [{
                data: [100, 200],
                dataLabels: {
                    enabled: true,
                    defer: false,
                    inside: true,
                    verticalAlign: 'top',
                    align: 'left',
                    rotation: 90
                },
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
            'Labels are visible'
        );
        assert.ok(
            Math.abs(
                Math.round(chart.series[0].points[0].dataLabel.element.getBoundingClientRect().top) -
                Math.round(chart.series[0].points[0].graphic.element.getBoundingClientRect().top)
            ) < 12,
            'Label is top aligned to element'
        );
        assert.ok(
            Math.abs(
                Math.round(chart.series[0].points[1].dataLabel.element.getBoundingClientRect().top) -
                Math.round(chart.series[0].points[1].graphic.element.getBoundingClientRect().top)
            ) < 12,
            'Label is top aligned to element'
        );

    });

});