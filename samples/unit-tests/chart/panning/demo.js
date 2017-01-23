/* global TestController */
QUnit.test('Zoom and pan key', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },

            title: {
                text: 'Zooming and panning'
            },

            subtitle: {
                text: 'Click and drag to zoom in. Hold down shift key to pan.'
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }),
        firstZoom = {};

    var test = TestController(chart);

    chart.setSize(600, 300);


    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Initial min'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        11,
        'Initial max'
    );


    // Zoom
    test.mousedown(200, 150);
    test.mousemove(250, 150);
    test.mouseup();

    assert.strictEqual(
        chart.xAxis[0].min > 0,
        true,
        'Zoomed min'
    );
    assert.strictEqual(
        chart.xAxis[0].max < 11,
        true,
        'Zoomed max'
    );

    firstZoom = chart.xAxis[0].getExtremes();

    // Pan
    test.mousedown(200, 100, { shiftKey: true });
    test.mousemove(150, 100, { shiftKey: true });
    test.mouseup();

    assert.strictEqual(
        chart.xAxis[0].min > firstZoom.min,
        true,
        'Has panned'
    );
    assert.strictEqual(
        chart.xAxis[0].max - chart.xAxis[0].min,
        firstZoom.max - firstZoom.min,
        'Has preserved range'
    );

});


QUnit.test('Stock (ordinal axis) panning (#6276)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 600
        },
        title: {
            text: 'AAPL stock price by minute'
        },
        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7D'
            }, {
                type: 'month',
                count: 1,
                text: '1M'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 1,
            inputEnabled: false
        },
        series: [{
            data: (function () {
                var arr = [];
                var y = 1;
                for (
                    var x = Date.UTC(2017, 0, 1);
                    x < Date.UTC(2017, 11, 31);
                    x += 24 * 36e5
                ) {
                    if (y % 7 !== 0) {
                        arr.push([x, y]);
                    }
                    y++;
                }
                return arr;
            }())
        }]
    });

    var controller = TestController(chart);

    var initialMin = chart.xAxis[0].min,
        initialRange = chart.xAxis[0].max - chart.xAxis[0].min;

    assert.strictEqual(
        initialMin,
        1511913600000,
        'Initial min'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        1514505600000,
        'Initial max'
    );

    // Pan
    controller.mousedown(100, 200);
    controller.mousemove(300, 200);
    controller.mouseup();

    assert.ok(
        chart.xAxis[0].min < initialMin,
        'Has panned'
    );

    assert.strictEqual(
        chart.xAxis[0].max - chart.xAxis[0].min,
        initialRange,
        'Has preserved range'
    );

});