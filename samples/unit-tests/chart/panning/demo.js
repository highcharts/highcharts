QUnit.test('Panning inverted chart(#4077)', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'bar',
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                width: 600,
                height: 400,
                animation: false
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
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                animation: false
            }]
        }),
        firstZoom = {};

    chart.container.parentNode.style.position = 'absolute';
    chart.container.parentNode.style.top = 0;


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
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 200,
        pageY: 150,
        target: chart.container
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 200,
        pageY: 200,
        target: chart.container
    });
    chart.pointer.onDocumentMouseUp({});

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
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 200,
        pageY: 100,
        target: chart.container,
        shiftKey: true
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 200,
        pageY: 50,
        target: chart.container,
        shiftKey: true
    });
    chart.pointer.onDocumentMouseUp({
    });

    assert.strictEqual(
        chart.xAxis[0].min > firstZoom.min,
        true,
        'Has panned'
    );
    assert.strictEqual(
        (chart.xAxis[0].max - chart.xAxis[0].min).toFixed(2),
        (firstZoom.max - firstZoom.min).toFixed(2),
        'Has preserved range'
    );


    chart.container.parentNode.style.position = 'static';

});

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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                reversed: true // #7857
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }),
        controller = new TestController(chart),
        firstZoom = {};

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
    controller.pan([200, 150], [250, 150]);

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
    controller.pan([200, 100], [150, 100], { shiftKey: true });
    assert.strictEqual(
        chart.xAxis[0].min < firstZoom.min,
        true,
        'Has panned'
    );
    assert.close(
        chart.xAxis[0].max - chart.xAxis[0].min,
        firstZoom.max - firstZoom.min,
        0.00001, // Roundoff error in Firefox
        'Has preserved range'
    );

    // Pan
    delete chart.pointer.chartPosition; // delete cache, QUnit header is moving chart
    controller.mouseDown(100, 200, { shiftKey: true });
    for (var x = 110; x < 400; x += 10) {
        controller.mouseMove(x, 100, { shiftKey: true });
    }
    controller.mouseUp();

    assert.strictEqual(
        chart.xAxis[0].max,
        11,
        'Chart should not pan out of data bounds (#7451)'
    );
    assert.close(
        chart.xAxis[0].max - chart.xAxis[0].min,
        firstZoom.max - firstZoom.min,
        0.00001, // Roundoff error in Firefox
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

    var controller = new TestController(chart);

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
    controller.pan([100, 200], [300, 200]);

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

QUnit.test('Pan all the way to extremes (#5863)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'area',
            panning: true,
            width: 800
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false
                }
            }
        },
        xAxis: {
            min: 1945,
            tickInterval: 5
        },
        series: [{
            name: 'USA',
            data: [235, 369, 640,
                1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                10871, 10824, 10577, 10527, 10475, 10421, 10358]
        }, {
            name: 'USSR/Russia',
            data: [5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                21000, 20000, 19000, 18000, 18000, 17000]
        }]
    });

    var controller = new TestController(chart);

    assert.strictEqual(
        chart.xAxis[0].tickPositions.toString(),
        '1945,1950,1955,1960,1965,1970,1975,1980,1985,1990,1995',
        'Right ticks'
    );

    // Pan
    controller.pan([100, 200], [200, 200]);
    assert.strictEqual(
        chart.xAxis[0].tickPositions.toString(),
        '1940,1945,1950,1955,1960,1965,1970,1975,1980,1985,1990',
        'Right ticks'
    );

    // Pan
    controller.pan([300, 200], [200, 200]);
    assert.strictEqual(
        chart.xAxis[0].tickPositions.toString(),
        '1945,1950,1955,1960,1965,1970,1975,1980,1985,1990,1995',
        'Right ticks'
    );
});

QUnit.test('Pan in vertical direction, and both directions. (Highstock only)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 600,
            panning: {
                type: 'y'
            }
        },
        title: {
            text: 'AAPL stock price by minute'
        },
        rangeSelector: {
            selected: 1,
            inputEnabled: false
        },
        series: [{
            data: (function () {
                var arr = [];
                var y = 1;
                for (
                    var x = Date.UTC(2017, 0, 1); x < Date.UTC(2017, 11, 31); x += 24 * 36e5
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

    var controller = new TestController(chart);

    var initialMin = chart.yAxis[0].min,
        initialRange = chart.yAxis[0].max - chart.yAxis[0].min;

    // Pan in vertical direction
    controller.pan([100, 200], [100, 100]);

    assert.ok(
        chart.yAxis[0].min < initialMin,
        'Has panned in Y direction.'
    );

    assert.strictEqual(
        Highcharts.correctFloat(chart.yAxis[0].max - chart.yAxis[0].min),
        Highcharts.correctFloat(initialRange),
        'Has preserved range.'
    );

    chart.update({
        chart: {
            panning: {
                type: 'xy'
            }
        }
    });

    var initialXMin = chart.xAxis[0].min,
        initialYMin = chart.yAxis[0].min,
        initialXRange = chart.xAxis[0].max - chart.xAxis[0].min,
        initialYRange = Highcharts.correctFloat(chart.yAxis[0].max - chart.yAxis[0].min);

    // Pan in both directions
    controller.pan([100, 100], [150, 150]);

    assert.ok(
        chart.xAxis[0].min < initialXMin &&
        chart.yAxis[0].min > initialYMin,
        'Has panned in both directions.'
    );

    assert.ok(
        chart.xAxis[0].max - chart.xAxis[0].min === initialXRange &&
        Highcharts.correctFloat(chart.yAxis[0].max - chart.yAxis[0].min) === initialYRange,
        'Has preserved range.'
    );
});