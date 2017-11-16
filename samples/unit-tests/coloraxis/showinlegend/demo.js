QUnit.test('showInLegend. #5544', function (assert) {
    var chart = Highcharts.chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3]
            }]
        }),
        items = chart.legend.getAllItems(),
        // While we wait for chart.update
        update = function (chart, options) {
            var newOptions = Highcharts.merge(chart.userOptions, options);
            chart.destroy();
            return Highcharts.chart(newOptions);
        };
    assert.notEqual(
        items[0].coll,
        'colorAxis',
        'colorAxis is not enabled, then it is also not shown in the legend.'
    );

    chart = update(chart, {
        colorAxis: {} // There is no colorAxis.enabled
    });
    items = chart.legend.getAllItems();
    assert.strictEqual(
        items[0].coll,
        'colorAxis',
        'colorAxis.showInLegend: true by default'
    );

    chart = update(chart, {
        colorAxis: {
            showInLegend: false
        }
    });
    items = chart.legend.getAllItems();
    assert.notEqual(
        items[0].coll,
        'colorAxis',
        'colorAxis.showInLegend: false'
    );

    chart = update(chart, {
        colorAxis: {
            showInLegend: true
        }
    });
    items = chart.legend.getAllItems();
    assert.strictEqual(
        items[0].coll,
        'colorAxis',
        'colorAxis.showInLegend: true'
    );

    chart = Highcharts.mapChart('container', {
        chart: {
            map: 'countries/au/au-all'
        },
        legend: {
            enabled: false
        },
        colorAxis: {
        },
        series: [{
            data: [['au-wa', 1], ['au-nt', 0]]
        }]
    });
    items = chart.container.querySelectorAll('svg > .highcharts-grid-line');
    assert.notOk(items && items.length, 'No stray ticks when legend disabled.');
});
