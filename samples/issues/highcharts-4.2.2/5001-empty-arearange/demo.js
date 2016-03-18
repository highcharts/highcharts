jQuery(function () {

    var datasets = [
        undefined,
        [
            [0, null, null]
        ],
        [
            [0, null, null],
            [1, null, null]
        ],
        [
            [0, null, null],
            [1, 1, 2]
        ],
        [
            [0, null, null],
            [1, 1, 2],
            [2, 2, 3]
        ],
        [
            [0, 1, 2],
            [1, null, null],
            [2, 2, 2]
        ],
        [
            [0, 1, 2],
            [1, 2, 3],
            [2, null, null]
        ]

    ];

    datasets.forEach(function (data, i) {

        QUnit.test('Empty arearange dataset #' + i, function (assert) {
            var chart = Highcharts.chart('container', {
                series: [{
                    type: 'arearange',
                    data: data
                }]
            });

            assert.strictEqual(
                chart.series[0].area.attr('d').indexOf('M'),
                0,
                'Valid area'
            );
        });
    });
});