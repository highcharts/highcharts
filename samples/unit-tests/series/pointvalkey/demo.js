QUnit.test('Mapping with pointValKey of custom sub options', function (assert) {
    var chart = Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                compare: 'percent'
            }
        },

        series: [{
            type: 'ohlc',
            pointValKey: 'custom.data',
            data: [
                {
                    custom: {
                        data: 50
                    }
                },
                {},
                {
                    custom: {
                        data: 10
                    }
                },
                {
                    custom: {
                        data: 20
                    }
                }
            ]
        }]
    });

    var series = chart.series[0];

    assert.deepEqual(
        [
            series.points[0].y,
            series.points[1].y,
            series.points[2].y,
            series.points[3].y
        ], [
            50,
            void 0,
            10,
            20
        ],
        'Point values should be set with custom data'
    );
});
