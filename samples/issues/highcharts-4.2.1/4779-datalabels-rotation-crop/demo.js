
$(function () {
    QUnit.test('Cropping of rotated data labels', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            yAxis: {
                min: 10,
                startOnTick: false
            },
            plotOptions: {
                column: {
                    animation: false,
                    justify: false,
                    stacking: 'normal',
                    dataLabels: {
                        rotation: 270,
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'John',
                data: [1, 3, 4, 7, 0]
            }, {
                name: 'Jane',
                data: [1, 2, 0, 20, 1]
            }, {
                name: 'Joe',
                data: [1, 4, 4, 30, 5]
            }]
        });

        var expected = [true, true, true, false, true, true, true, true, false, true, true, true, true, false, true];
        chart.series.forEach(function (series) {
            series.points.forEach(function (point) {
                assert.strictEqual(
                   point.dataLabel.attr('y') === -9999,
                   expected.shift(),
                   'Hidden as expected'
                );
            });
        });
    });
});