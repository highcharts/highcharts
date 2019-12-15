QUnit.test('Test different minSize and maxSize per series.(#4396)', function (assert) {
    var chart = $('#container').highcharts({
            chart: {
                type: 'bubble'
            },
            series: [{
                minSize: 5,
                maxSize: 8,
                data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
            }, {
                minSize: 10,
                maxSize: 35,
                data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
            }, {
                minSize: 20,
                maxSize: 40,
                data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
            }]
        }).highcharts(),
        radius;

    $.each(chart.series, function (i, s) {
        $.each(s.points, function (j, p) {
            radius = p.graphic.width;
            assert.strictEqual(
                radius <= s.options.maxSize && radius >= s.options.minSize,
                true,
                'Radius within range'
            );
        });
    });
});
QUnit.test('Distinct min and max for bubble padding.(#4313)', function (assert) {
    var chart = $('#container').highcharts({
            chart: {
                type: 'bubble'
            },
            xAxis: {
                gridLineWidth: 1,
                min: 0
            },
            yAxis: {
                startOnTick: false,
                endOnTick: false,
                min: 0
            },
            series: [{
                data: [
                    [9, 81, 63],
                    [98, 10, 189],
                    [51, 50, 73],
                    [41, 22, 14]
                ]
            }]
        }).highcharts(),
        topPoint = chart.series[0].points[0],
        rightPoint = chart.series[0].points[1],
        result,
        point,
        xAxis,
        approximateMin,
        maxDifference;

    assert.strictEqual(
        topPoint.graphic.y > 0,
        true,
        'Proper padding for yAxis.max'
    );
    assert.strictEqual(
        chart.plotWidth > rightPoint.graphic.x + rightPoint.graphic.width,
        true,
        'Proper padding for xAxis.max'
    );

    chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble',
            plotBorderWidth: 1
        },
        xAxis: {
            max: 2060
        },
        series: [{
            marker: {
                lineWidth: 0
            },
            data: [{
                x: 2900,
                y: 3300,
                z: 13.79
            }, {
                x: 2000,
                y: 2600,
                z: 30
            }, {
                x: 1200,
                y: 1500,
                z: 25
            }]
        }]
    });

    result = false;
    point = chart.series[0].points[2];
    xAxis = chart.xAxis[0];
    approximateMin = point.x - (xAxis.toValue(point.graphic.radius) - xAxis.toValue(0));
    maxDifference = xAxis.toValue(5) - xAxis.toValue(0);

    if (Math.abs(xAxis.min - approximateMin) < maxDifference) {
        result = true;
    }

    assert.ok(result, 'Proper xAxis.min when xAxis.max is set (#12543).');

    xAxis.update({
        max: 1500
    });

    result = false;
    approximateMin = point.x - (xAxis.toValue(point.graphic.radius) - xAxis.toValue(0));
    maxDifference = xAxis.toValue(5) - xAxis.toValue(0);

    if (Math.abs(xAxis.min - approximateMin) < maxDifference) {
        result = true;
    }

    assert.ok(result, 'Proper xAxis.min after update when xAxis.max is set (#12543).');
});

QUnit.test('Set min/max size', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble',
            animation: false,
            width: 200,
            height: 200
        },

        series: [{
            minSize: 30,
            maxSize: '1%',
            animation: false,
            data: [
                [0, 0, 0],
                [1, 0, 1],
                [2, 0, 2],
                [3, 0, 3],
                [4, 0, 4],
                [5, 0, 5]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].marker.radius,
        15,
        'Bubble size is minSize for lowest value, despite maxSize being computed smaller'
    );
    assert.strictEqual(
        chart.series[0].points[5].marker.radius,
        15,
        'Bubble size is minSize for highest value, despite maxSize being computed smaller'
    );
});