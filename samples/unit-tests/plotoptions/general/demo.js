QUnit.test('Plot options and series options priority (#3881)', assert => {

    const options = {
        series: [{
            type: 'column'
        }]
    };

    let chart;

    chart = Highcharts.chart('container', options);

    assert.strictEqual(
        chart.series[0].options.cropThreshold,
        50,
        'Pri 4: Default plotOptions.column value should be respected'
    );

    options.plotOptions = {
        series: {
            cropThreshold: 100
        }
    };
    chart = Highcharts.chart('container', options);
    assert.strictEqual(
        chart.series[0].options.cropThreshold,
        100,
        'Pri 3: When an option is set in the chart config plotOptions.series, it should override type default'
    );

    options.plotOptions.column = {
        cropThreshold: 150
    };
    chart = Highcharts.chart('container', options);
    assert.strictEqual(
        chart.series[0].options.cropThreshold,
        150,
        'Pri 2: When an option is set in the chart config plotOptions[type], it should override plotOptions.series'
    );

    options.series[0].cropThreshold = 200;
    chart = Highcharts.chart('container', options);
    assert.strictEqual(
        chart.series[0].options.cropThreshold,
        200,
        'Pri 1: When an option is set in the item, it trumps all'
    );
});


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