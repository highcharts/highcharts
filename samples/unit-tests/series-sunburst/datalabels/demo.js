QUnit.test('Rotation mode', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'sunburst',
            data: [{
                id: 'root'
            }, {
                parent: 'root',
                name: 'First',
                value: 1
            }, {
                parent: 'root',
                name: 'Second',
                value: 1
            }, {
                parent: 'root',
                name: 'Third',
                value: 1
            }, {
                parent: 'root',
                name: 'Fourth',
                value: 1
            }, {
                parent: 'root',
                name: 'Fifth',
                value: 1
            }, {
                parent: 'root',
                name: 'Sixth',
                value: 1
            }, {
                parent: 'root',
                name: 'Second',
                value: 1
            }, {
                parent: 'root',
                name: 'Eight',
                value: 1
            }]
        }]
    });

    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [0, 22.5, 67.5, -67.5, -22.5, 22.5, 67.5, -67.5, -22.5],
        'Auto rotationMode should be parallel'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'perpendicular'
        }
    });
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [90, -67.5, -22.5, 22.5, 67.5, -67.5, -22.5, 22.5, 67.5],
        'rotationMode should be perpendicular'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'parallel'
        }
    });
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [0, 22.5, 67.5, -67.5, -22.5, 22.5, 67.5, -67.5, -22.5],
        'rotationMode should be perpendicular'
    );

    chart.series[0].update({
        dataLabels: {
            rotationMode: 'auto'
        }
    });
    chart.series[0].points[1].update(4);
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Number(point.dataLabel.rotation.toFixed(1));
        }),
        [0, 65.5, 57.3, -90, -57.3, -24.5, 8.2, 40.9, 73.6],
        'Different sized points should give different rotation'
    );

});
