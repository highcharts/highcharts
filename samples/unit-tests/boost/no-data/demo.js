QUnit.test('No data module with boost', function (assert) {

    var data = [],
        n = 1000000,
        i;

    for (i = 0; i < n; i += 1) {
        var x = Math.pow(Math.random(), 2) * 100;
        data.push([
            x,
            Math.pow(Math.random(), 2) * 100
        ]);
    }

    var chart = Highcharts.chart('container', {

        chart: {
            height: '100%'
        },
        boost: {
            useGPUTranslations: true,
            usePreAllocated: true
        },
        xAxis: {
            min: 0,
            max: 100
        },
        yAxis: {
            min: 0,
            max: 100
        },
        series: [{
            type: 'scatter',
            data: data,
            marker: {
                radius: 0.1
            }
        }]
    });

    assert.strictEqual(
        chart.noDataLabel === undefined,
        true,
        'No-data should be invisible (#9758)'
    );

});
