QUnit.test('Random properties in plot options', assert => {

    Highcharts.chart('container', {
        plotOptions: {
            randomProperty: true,
            series: {
                color: 'red'
            }
        }
    });

    assert.ok('No error should occur on the above', true);
});