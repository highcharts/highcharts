QUnit.test('Treemap and updates', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'treemap',
                data: [{
                    id: 'id_1',
                    name: 'A'
                }, {
                    id: 'id_2',
                    name: 'A1',
                    value: 2,
                    parent: 'id_1'
                }, {
                    id: 'id_3',
                    name: 'A2',
                    value: 2,
                    parent: 'id_1'
                }, {
                    name: 'B',
                    value: 6
                }]
            }]
        }),
        series = chart.series[0];

    series.update({
        data: [{
            id: 'id_1',
            name: 'A'
        }, {
            id: 'id_2',
            name: 'A1',
            value: 10,
            parent: 'id_1'
        }, {
            id: 'id_3',
            name: 'A2',
            value: 12,
            parent: 'id_1'
        }, {
            name: 'B',
            value: 6
        }]
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-point').length,
        4,
        'All point-graphic elements exist in DOM (#11829)'
    );
});
