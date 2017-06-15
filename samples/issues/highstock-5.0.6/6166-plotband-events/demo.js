/* global TestController */

QUnit.test('Events should be bind to all plotBands.', function (assert) {
    var clicked,
        chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 20,
                max: 50,
                plotBands: [{
                    color: '#FCFFC5',
                    from: 0,
                    to: 11,
                    id: 'plotband-1',
                    events: {
                        click: function () {
                            console.log('ok');
                            clicked = 'clicked';
                        }
                    }
                }]
            },
            series: [{
                data: [
                    [1, 20],
                    [11, 20],
                    [21, 25],
                    [41, 28]
                ]
            }]
        });

    chart.xAxis[0].setExtremes(0, 10);

    var controller = new TestController(chart);
    controller.click(100, 100);

    assert.deepEqual(
        clicked,
        'clicked',
        'Click event fired'
    );
});