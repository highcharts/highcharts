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

QUnit.test('Updates', assert => {

    const chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointStart: 3
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    chart.update({
        plotOptions: {
            series: {
                pointInterval: 10
            }
        }
    });

    assert.strictEqual(
        chart.isInPlotOptions('pointStart'),
        true,
        'isInPlotOptions() method should return true when given property exist.'
    );

    assert.strictEqual(
        chart.isInPlotOptions('myNotExistingProperty'),
        false,
        'isInPlotOptions() method should return false when given property does not exist.'
    );

    assert.strictEqual(
        chart.series[0].data[1].x,
        13,
        'It is possible to update the plotOptions.series.pointInterval.'
    );

    chart.update({
        plotOptions: {
            series: {
                pointStart: 10
            }
        }
    });

    assert.strictEqual(
        chart.series[0].data[1].x,
        20,
        'It is possible to update the plotOptions.series.pointStart.'
    );
});
