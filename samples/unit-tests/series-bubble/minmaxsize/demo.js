QUnit.test('Setting X axis extremes on bubble (#5167)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble',
            animation: false
        },


        yAxis: {
            startOnTick: false,
            endOnTick: false,
            maxPadding: 0.2
        },

        series: [{
            data: [
                { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' },
                { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' }
            ]
        }]

    });

    chart.xAxis[0].setExtremes(85, 90);
    assert.ok(
        chart.yAxis[0].min < 102.9,
        'DE point is within range'
    );
    assert.ok(
        chart.yAxis[0].max > 102.9,
        'DE point is within range'
    );

});

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
        rightPoint = chart.series[0].points[1];

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