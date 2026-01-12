QUnit.test('Series shadows', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                shadow: {
                    color: 'red',
                    width: 10,
                    offsetX: 40,
                    offsetY: -20,
                    opacity: 0.05
                },
                data: [29, 71, 106, 129, 144]
            }
        ]
    });

    chart.series[0].update({
        shadow: {
            width: 20,
            offsetY: 20,
            color: 'blue',
            opacity: 0.8,
            offsetX: 0
        }
    });

    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('blue') !== -1,
        'Shadows should be updated (#12091)'
    );

    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('-20-') !== -1,
        'Shadows amount should be updated (#12091)'
    );

    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('userspaceonuse') !== -1,
        `Shadow should have 'filterUnits: userSpaceOnUse' attribute
        with line series (#19093)`
    );

    chart.series[0].update({
        shadow: true
    });

    assert.strictEqual(
        chart.series[0].graph.attr('filter'),
        `url(#highcharts-drop-shadow-${
            chart.index
        }-filterunits-userspaceonuse)`,
        'Shadows should be updated when old options defined as object and ' +
        'new as boolean (#12091, #19093).'
    );

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [
            {
                shadow: true,
                data: [29, 71, 106, 129, 144]
            }
        ]
    });

    chart.series[0].update({
        shadow: {
            width: 20,
            offsetY: 10,
            color: 'red',
            opacity: 0.9,
            offsetX: 5
        }
    });

    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('red') !== -1,
        'Shadows should be updated when old options defined as boolean and ' +
        'new as object (#12091).'
    );

    // Test that inverted charts don't use filterUnits
    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('userspaceonuse') === -1,
        'Inverted charts should not use filterUnits: userSpaceOnUse'
    );

    chart.series[0].update({
        type: 'column'
    });

    const firstColumn = chart.series[0].points[0];

    assert.ok(
        firstColumn.graphic.attr('filter').indexOf('userpacense') === -1,
        `Shadow shouldn't have 'filterUnits: userSpaceOnUse' on other types
        of series (#19093)`
    );
});

QUnit.test('Shadow with zones and inverted charts', function (assert) {
    // Test that shadow is only applied to main series, not zones
    var chart = Highcharts.chart('container', {
        series: [{
            data: [10, 20, 15, 25, 20],
            shadow: {
                color: 'blue',
                width: 5
            },
            zones: [{
                value: 15,
                color: 'red'
            }]
        }]
    });

    // Main series should have shadow
    assert.ok(
        chart.series[0].graph.attr('filter') !== 'none' &&
        chart.series[0].graph.attr('filter') !== null,
        'Main series should have shadow'
    );

    // Zones should not have shadow (shadow is only on main series)
    if (chart.series[0].zones && chart.series[0].zones.length > 0) {
        const zoneGraph = chart.series[0].zones[0].graph;
        if (zoneGraph) {
            const filter = zoneGraph.attr('filter');
            assert.ok(
                !filter || filter === 'none',
                'Zones should not have shadow'
            );
        }
    }

    // Test that normal charts use filterUnits
    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('userspaceonuse') !== -1,
        'Normal charts should use filterUnits: userSpaceOnUse'
    );

    // Test inverted chart without filterUnits
    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [{
            data: [10, 20, 15, 25, 20],
            shadow: {
                color: 'green',
                width: 5
            }
        }]
    });

    // Inverted chart should not use filterUnits
    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('userspaceonuse') === -1,
        'Inverted charts should not use filterUnits: userSpaceOnUse'
    );

    // But should still have shadow
    assert.ok(
        chart.series[0].graph.attr('filter') !== 'none' &&
        chart.series[0].graph.attr('filter') !== null,
        'Inverted charts should still have shadow'
    );
});

QUnit.test('Shadow with polar charts', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            polar: true
        },
        pane: {
            startAngle: 0,
            endAngle: 360
        },
        xAxis: {
            tickInterval: 45,
            min: 0,
            max: 360
        },
        yAxis: {
            min: 0
        },
        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            }
        },
        series: [{
            type: 'line',
            data: [1, 2, 3, 4, 5, 6, 7, 8],
            shadow: {
                color: 'purple',
                width: 10,
                offsetX: 5,
                offsetY: 5,
                opacity: 0.7
            }
        }]
    });

    // Polar chart should have shadow
    assert.ok(
        chart.series[0].graph.attr('filter') !== 'none' &&
        chart.series[0].graph.attr('filter') !== null,
        'Polar charts should have shadow'
    );

    // Polar charts should use filterUnits: userSpaceOnUse
    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('userspaceonuse') !== -1,
        'Polar charts should use filterUnits: userSpaceOnUse'
    );

    // Shadow should contain the color
    assert.ok(
        chart.series[0].graph.attr('filter').indexOf('purple') !== -1,
        'Polar chart shadow should contain the specified color'
    );
});
