/* global TestController */

QUnit.test('Global marker is null (#6321)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble'
        },

        plotOptions: {
            series: {
                animation: false,
                marker: {
                    enabled: null
                }
            }
        },

        series: [{
            data: [
                { x: 3, y: 1, z: 1, name: 'BE', country: 'Belgium' },
                { x: 3, y: 5, z: 1, name: 'FI', country: 'Finland' }
            ]
        },
        {
            data: [
                { x: 1, y: 1, z: 1, name: 'BE', country: 'Belgium' },
                { x: 4, y: 5, z: 1, name: 'FI', country: 'Finland' }
            ]
        }]

    });

    assert.strictEqual(
        typeof chart.series[0].points[0].graphic,
        'object',
        'Has marker'
    );
});

QUnit.test('Clicking marker (#6705)', function (assert) {

    var clicked;

    var chart = Highcharts.chart('container', {
        series: [{
            animation: false,
            cursor: 'pointer',
            type: 'bubble',
            point: {
                events: {
                    click: function () {
                        // console.log('click');
                        clicked = true;
                    }
                }
            },
            states: {
                hover: {
                    halo: {
                        size: 10
                    }
                }
            },
            data: [
                [1, 2, 3]
            ]
        }]
    });

    var controller = new TestController(chart);

    controller.mouseOver(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY
    );

    controller.click(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY
    );

    assert.strictEqual(
        clicked,
        true,
        'Click event fired'
    );
});