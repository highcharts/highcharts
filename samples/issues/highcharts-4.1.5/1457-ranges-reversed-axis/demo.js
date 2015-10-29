$(function () {
    QUnit.test('Reversed axis range', function (assert) {

        var chart = new Highcharts.Chart({

            chart: {
                renderTo: 'container',
                type: 'columnrange',
                inverted: false
            },

            yAxis: {
                reversed: true
            },

            series: [{
                animation: false,
                name: 'Temperatures',
                data: [
                    [1, 2],
                    [2, 3],
                    [3, 4]
                ],
                dataLabels: {
                    enabled: true
                }
            }]

        });

        var point = chart.series[0].points[0];
        assert.strictEqual(
            parseInt(point.graphic.element.getAttribute('height'), 10) > 25,
            true,
            'First element has a height'
        );

        assert.strictEqual(
            point.dataLabel.y < point.plotLow,
            true,
            '"Low" data label is drawn above point'
        );
        assert.strictEqual(
            Math.round(point.dataLabelUpper.y) >= Math.round(point.plotHigh),
            true,
            '"High" data label is drawn below point'
        );
    });


    QUnit.test('Reversed axis range - inverted', function (assert) {

        var chart = new Highcharts.Chart({

            chart: {
                renderTo: 'container',
                type: 'columnrange',
                inverted: true
            },

            yAxis: {
                reversed: true
            },

            series: [{
                animation: false,
                name: 'Temperatures',
                data: [
                    [1, 2],
                    [2, 3],
                    [3, 4]
                ],
                dataLabels: {
                    enabled: true
                }
            }]

        });

        var point = chart.series[0].points[0];
        assert.strictEqual(
            parseInt(point.graphic.element.getAttribute('height'), 10) > 25,
            true,
            'First element has a height'
        );
    });

});