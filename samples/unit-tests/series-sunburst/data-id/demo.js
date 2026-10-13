QUnit.test('series.data.id: default to string', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [
                {
                    type: 'sunburst',
                    data: [1, 2]
                }
            ]
        }),
        series = chart.series[0],
        result;
    result = !H.find(series.points, function (p) {
        return typeof p.id !== 'string';
    });
    assert.strictEqual(
        result,
        true,
        'All points have a property id of type String'
    );
});

QUnit.test('series.data.id: custom id', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [
                {
                    type: 'sunburst',
                    data: [
                        {
                            value: 1,
                            id: '1'
                        },
                        {
                            value: 2,
                            id: '2'
                        }
                    ]
                }
            ]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.points[0].id,
        '1',
        'series.points[0] has a property id with value of "1"'
    );
    assert.strictEqual(
        series.points[1].id,
        '2',
        'series.points[1] has a property id with value of "2"'
    );
});

QUnit.test('series.data.id: built-in object property names', function (assert) {
    let duplicateIdWarnings = 0;
    const removeErrorEvent = Highcharts.addEvent(
        Highcharts,
        'displayError',
        function (event) {
            if (event.code === 31) {
                duplicateIdWarnings++;
                event.preventDefault();
            }
        }
    );

    try {
        const chart = Highcharts.chart('container', {
                series: [{
                    type: 'sunburst',
                    data: [{
                        id: 'toString',
                        value: 1
                    }, {
                        id: '__proto__',
                        value: 1
                    }]
                }]
            }),
            protoId = '__proto__';

        assert.ok(
            chart.series[0].nodeMap.toString &&
                chart.series[0].nodeMap[protoId],
            'Both built-in-named nodes should be available'
        );
        assert.strictEqual(
            duplicateIdWarnings,
            0,
            'Distinct built-in-named nodes should not report duplicate IDs'
        );
    } finally {
        removeErrorEvent();
    }
});
