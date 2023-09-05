QUnit.test('Plot options and series options priority (#3881)', assert => {
    const options = {
        series: [
            {
                type: 'column'
            }
        ]
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

    chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointStart: 10
            }
        },
        series: [{
            data: [1, 2, 3, 4],
            pointStart: 100
        }, {
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        chart.series[0].data[0].x,
        100,
        `The pointStart property set directly on series should take precedence
        over plotOptions.series.pointStart.`
    );

    assert.strictEqual(
        chart.series[1].data[0].x,
        10,
        'The plotOptions.series.pointStart should be applied to other series.'
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
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    chart.update({
        plotOptions: {
            series: {
                pointInterval: 10
            }
        }
    });

    assert.strictEqual(
        chart.series[0].data[1].x,
        10,
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
        chart.series[0].data[0].x,
        10,
        'It is possible to update the plotOptions.series.pointStart.'
    );

    chart.series[0].update({
        pointInterval: 20
    });

    assert.strictEqual(
        chart.series[0].data[1].x,
        30,
        'It is possible to update the series.pointInterval.'
    );

    chart.update({
        plotOptions: {
            series: {
                pointStart: 20
            }
        }
    });

    assert.strictEqual(
        chart.series[0].data[0].x,
        20,
        `It is possible to update plotOptions.series.pointStart more than once,
        #19203.`
    );

    chart.series[0].update({
        pointStart: 13
    });

    assert.strictEqual(
        chart.series[0].data[0].x,
        13,
        'It is possible to update series.pointStart.'
    );
});

QUnit.test('hasOptionChanged() method', assert => {
    let chart;

    chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointStart: 210
            }
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].hasOptionChanged('dataGrouping'),
        false,
        'Property defined in plotOptions should not be detected as change.'
    );

    chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointStart: 210
            }
        },
        series: [
            {
                pointStart: 210,
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].hasOptionChanged('pointStart'),
        false,
        'Property defined in both series and plotOptions should not be detected as change.'
    );

    chart = Highcharts.chart('container', {
        series: [
            {
                pointStart: 200,
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].hasOptionChanged('pointStart'),
        false,
        'Property defined in series should not be detected as change.'
    );

    chart = Highcharts.chart('container', {
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].hasOptionChanged('pointStart'),
        false,
        'Should return false when given property has not changed - primitives.'
    );

    // assert.strictEqual(
    //     chart.series[0].hasOptionChanged('dataLabels'),
    //     false,
    //     'Should return false when given property has not changed - objects.'
    // );

    chart.options.plotOptions.line.pointStart = 11;

    assert.strictEqual(
        chart.series[0].hasOptionChanged('pointStart'),
        true,
        'Should return true when given property has changed - primitives.'
    );

    chart.options.plotOptions.line.dataLabels.padding = 7;

    assert.strictEqual(
        chart.series[0].hasOptionChanged('dataLabels'),
        true,
        'Should return true when given property has changed - objects.'
    );

    assert.ok(true, 'Should not throw an error.');

});
