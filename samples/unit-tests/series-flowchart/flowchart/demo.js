QUnit.test('Flowchart layout', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'flowchart',
            width: 600,
            height: 600
        },
        series: [{
            // Two decisions and one back edge (F -> A) closing a cycle, plus
            // a long link (A -> F) spanning several layers.
            data: [
                ['A', 'B'],
                ['A', 'C'],
                ['B', 'D'],
                ['C', 'D'],
                ['D', 'E'],
                ['E', 'F'],
                ['A', 'F', 'shortcut'],
                ['F', 'A', 'loop back']
            ],
            nodes: [{
                id: 'A',
                shape: 'oval'
            }, {
                id: 'D',
                shape: 'diamond'
            }]
        }]
    });

    const series = chart.series[0],
        node = id => series.nodes.find(n => n.id === id);

    assert.strictEqual(
        series.nodes.length,
        6,
        'Nodes should be generated from the links'
    );

    assert.strictEqual(
        series.points.length,
        8,
        'Every link should become a point'
    );

    assert.ok(
        series.nodes.every(
            n => Highcharts.isNumber(n.plotX) &&
            Highcharts.isNumber(n.plotY)
        ),
        'Every node should get a position from the layout'
    );

    // Layering runs top to bottom, so a node always sits below the ones it
    // follows - the whole point of the layered layout.
    assert.ok(
        node('A').plotY < node('B').plotY &&
        node('B').plotY < node('D').plotY &&
        node('D').plotY < node('E').plotY &&
        node('E').plotY < node('F').plotY,
        'Nodes should be stacked in flow order'
    );

    assert.deepEqual(
        series.points.map(p => p.reversed),
        [false, false, false, false, false, false, false, true],
        'Only the cycle-closing link should be reversed'
    );

    const longLink = series.points[6];

    assert.ok(
        longLink.waypoints.length > 2,
        'A link spanning several layers should be routed through waypoints'
    );

    assert.deepEqual(
        [
            longLink.waypoints[0],
            longLink.waypoints[longLink.waypoints.length - 1]
        ],
        [
            { x: node('A').plotX, y: node('A').plotY },
            { x: node('F').plotX, y: node('F').plotY }
        ],
        'A link should start and end on its own nodes'
    );

    const backLink = series.points[7];

    assert.deepEqual(
        backLink.waypointIds[backLink.waypointIds.length - 1],
        'A',
        'A reversed link should still be routed toward its data `to` node, ' +
        'so the arrowhead lands there'
    );

    // Shapes are sized to their label, so a diamond - which has to be twice
    // its text box to inscribe it - ends up bigger than a plain rectangle
    // with a label of the same length.
    assert.ok(
        node('D').shapeWidth > node('B').shapeWidth &&
        node('D').shapeHeight > node('B').shapeHeight,
        'A diamond should be grown around its label'
    );

    assert.strictEqual(
        node('A').graphic.symbolName,
        'oval',
        'A node should be drawn with the symbol its shape maps to'
    );

    assert.strictEqual(
        node('B').shape,
        'rectangle',
        'A node without a shape should fall back to `nodeShape`'
    );

    // The layout positions node centers; the series insets them by half of
    // the largest node so no shape hangs over the edge of the plot area.
    const fits = series => series.nodes.every(n => (
        n.plotX - n.shapeWidth / 2 >= -1 &&
        n.plotX + n.shapeWidth / 2 <= series.chart.plotWidth + 1 &&
        n.plotY - n.shapeHeight / 2 >= -1 &&
        n.plotY + n.shapeHeight / 2 <= series.chart.plotHeight + 1
    ));

    assert.ok(
        fits(series),
        'Every node should fit inside the plot area'
    );

    // A long label makes for a wide shape, which is exactly the case a fixed
    // margin would let spill out of the plot.
    series.update({
        nodes: [{
            id: 'A',
            shape: 'oval',
            name: 'A node with a rather long name on it'
        }, {
            id: 'F',
            name: 'Another node with a rather long name on it'
        }]
    });

    assert.ok(
        fits(series),
        'A node wide enough to reach the edge should still fit'
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-flowchart-arrow')
            .length,
        8,
        'Every link should get an arrowhead'
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-link-reversed').length,
        1,
        'A reversed link should be marked with a class name'
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-flowchart-waypoint')
            .length,
        0,
        'Waypoint markers should be off by default'
    );

    series.update({
        waypoints: {
            enabled: true
        }
    });

    assert.ok(
        chart.container.querySelectorAll('.highcharts-flowchart-waypoint')
            .length > 0,
        'Enabling `waypoints` should draw a marker per interior waypoint'
    );

    series.update({
        waypoints: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-flowchart-waypoint')
            .length,
        0,
        'Disabling `waypoints` again should remove the markers, not orphan ' +
        'them'
    );
});

QUnit.test('Flowchart link labels', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'flowchart',
            width: 600,
            height: 400
        },
        series: [{
            data: [
                ['Start', 'Valid?'],
                ['Valid?', 'Go on', 'Yes'],
                ['Valid?', 'Stop', 'No']
            ],
            nodes: [{
                id: 'Valid?',
                shape: 'diamond'
            }]
        }]
    });

    const series = chart.series[0];

    assert.deepEqual(
        series.points.map(p => p.options.text),
        [void 0, 'Yes', 'No'],
        'An array link should parse as [from, to, text] without explicit keys'
    );

    assert.deepEqual(
        series.points.map(p => (
            p.dataLabel ? p.dataLabel.text.textStr : null
        )),
        [null, 'Yes', 'No'],
        'A link label should show its own text, and a link without one ' +
        'should get no label at all'
    );

    assert.ok(
        series.points.every(
            p => Highcharts.isNumber(p.plotX) &&
            Highcharts.isNumber(p.plotY)
        ),
        'A link should have a label anchor before anything is hovered'
    );

    assert.deepEqual(
        series.nodes.map(n => n.dataLabel.text.textStr),
        ['Start', 'Valid?', 'Go on', 'Stop'],
        'A node label should show the node name'
    );
});

QUnit.test('Flowchart degenerate data', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'flowchart',
            width: 600,
            height: 400
        },
        series: [{
            data: [
                ['A', 'A'],
                ['A', 'B']
            ],
            nodes: [{
                id: 'Detached'
            }]
        }]
    });

    const series = chart.series[0];

    assert.strictEqual(
        series.nodes.length,
        3,
        'A standalone node option should still create a node'
    );

    assert.ok(
        series.nodes.every(
            n => Highcharts.isNumber(n.plotX) &&
            Highcharts.isNumber(n.plotY)
        ),
        'A self-referencing link and an unlinked node should not break the ' +
        'layout'
    );

    series.setData([['A', 'B'], ['B', 'C']]);

    assert.strictEqual(
        series.points.length,
        2,
        'The series should survive a full data replacement'
    );
});

QUnit.test('Flowchart inert simulation options', function (assert) {
    const plotOptions = Highcharts.getOptions().plotOptions;

    assert.strictEqual(
        plotOptions.flowchart.layoutAlgorithm,
        undefined,
        'A flowchart should not carry a force-simulation config it cannot run'
    );

    // The guard against the one real regression risk here: the flowchart
    // defaults are built from a `merge` copy of the networkgraph ones, so
    // dropping `layoutAlgorithm` must not reach the shared parent.
    assert.ok(
        plotOptions.networkgraph.layoutAlgorithm,
        'Networkgraph should keep its own layoutAlgorithm defaults'
    );

    assert.strictEqual(
        plotOptions.networkgraph.layoutAlgorithm.type,
        'reingold-fruchterman',
        'Networkgraph layoutAlgorithm defaults should be intact'
    );

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'flowchart',
            width: 600,
            height: 400
        },
        series: [{
            // Explicitly asking for a simulation should be inert, not fatal.
            layoutAlgorithm: {
                enableSimulation: true,
                type: 'reingold-fruchterman'
            },
            data: [
                ['A', 'B'],
                ['B', 'C'],
                ['C', 'A']
            ]
        }]
    });

    const series = chart.series[0];

    assert.strictEqual(
        series.layout,
        undefined,
        'A user-supplied layoutAlgorithm should not start a graph layout'
    );

    assert.strictEqual(
        chart.graphLayoutsStorage,
        undefined,
        'No graph layout should be registered on the chart'
    );

    assert.ok(
        series.nodes.every(
            n => Highcharts.isNumber(n.plotX) &&
            Highcharts.isNumber(n.plotY)
        ),
        'Nodes should still be laid out by the layered solver'
    );

    const layerOrder = ['A', 'B', 'C'].map(
        id => series.nodes.find(n => n.id === id).plotY
    );

    assert.ok(
        layerOrder[0] < layerOrder[1] && layerOrder[1] < layerOrder[2],
        'Layers should still run top to bottom'
    );

    // `deferLayout` is overridden as a no-op because the networkgraph
    // implementation reads `layoutAlgorithm.type` unguarded, which would now
    // throw. Call it directly rather than trusting that nothing reaches it.
    series.deferLayout();

    assert.strictEqual(
        series.layout,
        undefined,
        'deferLayout should be a no-op that cannot throw'
    );

    assert.strictEqual(
        chart.graphLayoutsStorage,
        undefined,
        'deferLayout should not create a layout store'
    );
});
