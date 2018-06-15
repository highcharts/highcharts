QUnit.test('showInLegend. #5544', function (assert) {
    var chart = Highcharts.chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                type: 'heatmap',
                data: [
                    [0, 0, 10],
                    [0, 1, 19],
                    [0, 2, 8],
                    [1, 0, 92],
                    [1, 1, 58],
                    [1, 2, 78]
                ]
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
    var colorAxisItem = Highcharts.find(
        chart.legend.getAllItems(),
        function (item) {
            return item instanceof Highcharts.ColorAxis;
        }
    );
    assert.ok(!colorAxisItem, 'colorAxis.showInLegend: false');

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.container.querySelector('.highcharts-coloraxis-marker'),
        null,
        'Marker should not display on hidden color axis'
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
});

QUnit.test('Grid lines, disabled color axis legend', function (assert) {

    var chart = Highcharts.mapChart('container', {
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
    var items = chart.container.querySelectorAll('svg > .highcharts-grid-line');
    assert.notOk(items && items.length, 'No stray ticks when legend disabled.');
});
