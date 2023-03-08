QUnit.test('No data module with boost', function (assert) {
    var data = [],
        n = 10,
        i;

    for (i = 0; i < n; i += 1) {
        data.push([i, i]);
    }

    var chart = Highcharts.chart('container', {
        chart: {
            height: '400'
        },
        boost: {
            useGPUTranslations: true,
            usePreAllocated: true
        },
        xAxis: {
            min: 0,
            max: 10
        },
        yAxis: {
            min: 0,
            max: 10
        },
        series: [
            {
                type: 'scatter',
                data: data,
                marker: {
                    radius: 2
                },
                boostThreshold: 1
            }
        ]
    });

    assert.strictEqual(chart.boosted, true, 'The chart should be boosting');

    assert.strictEqual(
        chart.noDataLabel,
        void 0,
        'No-data should be invisible (#9758)'
    );
});
