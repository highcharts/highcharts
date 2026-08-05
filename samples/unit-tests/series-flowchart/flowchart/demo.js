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

    // The layout's own bounding box is sized to hold every shape, and the
    // series centers that box in the plot area, so no shape hangs over an edge.
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

QUnit.test('Flowchart size-aware layout', function (assert) {
    // Long labels and mixed shapes, so node widths differ a lot - the case a
    // layout that does not consult node sizes gets wrong.
    const data = [
        ['Start', 'ReceiveOrder'],
        ['ReceiveOrder', 'CheckInventory'],
        ['CheckInventory', 'InStock'],
        ['InStock', 'ProcessPayment', 'Yes'],
        ['InStock', 'Backorder', 'No'],
        ['Backorder', 'CheckInventory', 'Restocked'],
        ['Backorder', 'CancelOrder', 'Unable'],
        ['ProcessPayment', 'PaymentValid'],
        ['PaymentValid', 'ShipItem', 'Yes'],
        ['PaymentValid', 'RequestRetry', 'No'],
        ['RequestRetry', 'ProcessPayment', 'Retry'],
        ['RequestRetry', 'CancelOrder', 'Give up'],
        ['CancelOrder', 'End'],
        ['ShipItem', 'NotifyCustomer'],
        ['NotifyCustomer', 'End']
    ];
    const nodes = [
        { id: 'Start', shape: 'oval' },
        { id: 'End', shape: 'oval', name: 'Order closed' },
        { id: 'ReceiveOrder', shape: 'parallelogram', name: 'Receive order' },
        { id: 'CheckInventory', shape: 'cylinder', name: 'Check inventory' },
        { id: 'InStock', shape: 'diamond', name: 'In stock?' },
        { id: 'Backorder', shape: 'hexagon', name: 'Backorder item' },
        { id: 'ProcessPayment', shape: 'subroutine', name: 'Process payment' },
        { id: 'PaymentValid', shape: 'diamond', name: 'Payment valid?' },
        { id: 'RequestRetry', name: 'Request retry' },
        { id: 'CancelOrder', name: 'Cancel order' },
        { id: 'ShipItem', name: 'Ship item' },
        { id: 'NotifyCustomer', shape: 'document', name: 'Notify customer' }
    ];

    const chart = Highcharts.chart('container', {
        chart: { type: 'flowchart', width: 1000, height: 800 },
        series: [{ data: data, nodes: nodes }]
    });
    const series = chart.series[0];

    // Group nodes into layers by their row, which is what the layout spaces.
    const layersOf = s => {
        const layers = {};
        s.nodes.forEach(function (n) {
            const key = Math.round(n.plotY);
            (layers[key] = layers[key] || []).push(n);
        });
        return layers;
    };

    [
        [1000, 800], [1000, 500], [800, 500], [600, 500],
        [480, 500], [375, 500], [320, 500], [1000, 320]
    ].forEach(function (size) {
        chart.setSize(size[0], size[1], false);

        const label = size[0] + 'x' + size[1],
            layers = layersOf(series),
            keys = Object.keys(layers).map(Number).sort((a, b) => a - b);

        let minGapX = Infinity;
        keys.forEach(function (k) {
            const row = layers[k].slice().sort((a, b) => a.plotX - b.plotX);
            for (let i = 0; i < row.length - 1; i++) {
                minGapX = Math.min(
                    minGapX,
                    (row[i + 1].plotX - row[i + 1].shapeWidth / 2) -
                    (row[i].plotX + row[i].shapeWidth / 2)
                );
            }
        });

        let minGapY = Infinity;
        for (let i = 0; i < keys.length - 1; i++) {
            const hA = Math.max(...layers[keys[i]].map(n => n.shapeHeight)),
                hB = Math.max(...layers[keys[i + 1]].map(n => n.shapeHeight));
            minGapY = Math.min(
                minGapY, (keys[i + 1] - hB / 2) - (keys[i] + hA / 2)
            );
        }

        // The point of a size-aware layout: no two nodes sharing a layer may
        // overlap, and no two layers may either, at any chart size. Before the
        // layout consulted node sizes this failed from 800px down, by as much
        // as 122px.
        assert.ok(
            minGapX >= -0.01,
            'No horizontal node overlap at ' + label +
            ' (min gap ' + minGapX.toFixed(1) + ')'
        );

        assert.ok(
            minGapY >= -1,
            'No layer overlap at ' + label +
            ' (min gap ' + minGapY.toFixed(1) + ')'
        );

        // Tightening the gaps and then shrinking together guarantee a fit, so
        // nothing should reach outside the plot area at all - the series is
        // clipped to it, and anything outside is lost rather than merely
        // spilled.
        let overflow = 0;
        series.nodes.forEach(function (n) {
            overflow = Math.max(
                overflow,
                -(n.plotX - n.shapeWidth / 2),
                (n.plotX + n.shapeWidth / 2) - chart.plotWidth,
                -(n.plotY - n.shapeHeight / 2),
                (n.plotY + n.shapeHeight / 2) - chart.plotHeight
            );
        });

        assert.ok(
            overflow <= 0.5,
            'Whole diagram inside the plot area at ' + label +
            ' (overflow ' + overflow.toFixed(1) + ')'
        );

        // The gap closes up before anything shrinks, and never below the
        // minimum that keeps neighbours reading as separate shapes - itself
        // scaled once the diagram starts shrinking.
        assert.ok(
            minGapX >= 4 * series.layoutScale - 0.5,
            'Gap holds at or above its floor at ' + label +
            ' (gap ' + minGapX.toFixed(1) + ', scale ' +
            series.layoutScale.toFixed(3) + ')'
        );
    });

    // Walk a width sweep through the transition and check the two stages
    // happen in order: the gap closes first, and only once it has bottomed out
    // does anything shrink.
    const steps = [];
    [820, 760, 720, 700, 680, 660, 640, 600, 480, 375, 320]
        .forEach(function (width) {
            chart.setSize(width, 700, false);

            const layers = layersOf(series);
            let gap = Infinity;
            Object.keys(layers).forEach(function (k) {
                const row = layers[k].slice()
                    .sort((a, b) => a.plotX - b.plotX);
                for (let i = 0; i < row.length - 1; i++) {
                    gap = Math.min(
                        gap,
                        (row[i + 1].plotX - row[i + 1].shapeWidth / 2) -
                        (row[i].plotX + row[i].shapeWidth / 2)
                    );
                }
            });

            steps.push({
                width,
                gap,
                labelWidth: series.labelWidth,
                scale: series.layoutScale
            });
        });

    for (let i = 1; i < steps.length; i++) {
        const wide = steps[i - 1],
            narrow = steps[i],
            at = wide.width + ' -> ' + narrow.width;

        // Two consecutive widths are only comparable while their labels are
        // wrapped the same way. Wrapping at a narrower width makes the boxes
        // narrower, which hands room back to the gap - a reflow, the way a
        // column of text reflows, and the one place in the sweep where a
        // narrower chart is allowed a wider gap than a wider one.
        if (narrow.labelWidth === wide.labelWidth) {
            assert.ok(
                narrow.gap <= wide.gap + 0.5,
                'Gap does not grow as the chart narrows, ' + at +
                ' (' + wide.gap.toFixed(1) + ' -> ' +
                narrow.gap.toFixed(1) + ')'
            );
        } else {
            assert.ok(
                narrow.gap >= 4 * narrow.scale - 0.5,
                'Re-wrapping leaves the gap at or above its floor, ' + at +
                ' (gap ' + narrow.gap.toFixed(1) + ', scale ' +
                narrow.scale.toFixed(3) + ')'
            );
        }

        // Scale stays monotonic across a re-wrap too: the caps tried are the
        // same at every size, and each one fits a wider chart at least as well
        // as a narrower one, so the best of them cannot improve as room is
        // taken away.
        assert.ok(
            narrow.scale <= wide.scale + 0.001,
            'Scale does not grow as the chart narrows, ' + at +
            ' (' + wide.scale.toFixed(3) + ' -> ' +
            narrow.scale.toFixed(3) + ')'
        );
    }

    // Stage order: nothing shrinks while there is still gap to give back.
    steps.forEach(function (step) {
        if (step.scale < 1) {
            assert.ok(
                step.gap <= 4 * step.scale + 1.5,
                'Shrinking only starts once the gap has bottomed out, at ' +
                step.width + ' (gap ' + step.gap.toFixed(1) + ', scale ' +
                step.scale.toFixed(3) + ')'
            );
        }
    });

    assert.ok(
        steps[0].scale === 1 && steps[steps.length - 1].scale < 1,
        'The sweep should span both stages (widest scale ' +
        steps[0].scale.toFixed(3) + ', narrowest ' +
        steps[steps.length - 1].scale.toFixed(3) + ')'
    );

    // Re-solving on resize must not rebuild the layered graph: a resize
    // changes how much room there is, not what connects to what.
    const cached = series.topologyCache.topology;
    chart.setSize(700, 450, false);

    assert.strictEqual(
        series.topologyCache.topology,
        cached,
        'A resize should reuse the cached topology'
    );

    series.setData([['A', 'B'], ['B', 'C']]);

    assert.notStrictEqual(
        series.topologyCache.topology,
        cached,
        'New data should rebuild the topology'
    );
});

QUnit.test('Flowchart dragged nodes track the diagram', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: { type: 'flowchart', width: 900, height: 640 },
        series: [{
            nodes: [
                { id: 'Start', shape: 'oval' },
                { id: 'Stock', shape: 'cylinder', name: 'Check inventory' },
                { id: 'InStock', shape: 'diamond', name: 'In stock?' },
                { id: 'Backorder', shape: 'hexagon', name: 'Backorder item' },
                { id: 'Pay', shape: 'subroutine', name: 'Process payment' },
                { id: 'Cancel', name: 'Cancel order' },
                { id: 'End', shape: 'oval', name: 'Order closed' }
            ],
            data: [
                ['Start', 'Stock'], ['Stock', 'InStock'],
                ['InStock', 'Pay', 'Yes'], ['InStock', 'Backorder', 'No'],
                ['Backorder', 'Stock', 'Restocked'],
                ['Backorder', 'Cancel', 'Unable'],
                ['Pay', 'End'], ['Cancel', 'End']
            ]
        }]
    });

    const series = chart.series[0],
        node = id => series.nodes.find(n => n.id === id),
        dragged = node('Cancel');

    // Record a drop the way `onMouseMove` does: as a displacement from where
    // the layout put the node, in the layout's own units.
    const nudge = { x: 140, y: -50 },
        dropX = dragged.plotX + nudge.x,
        dropY = dragged.plotY + nudge.y;
    dragged.plotX = dropX;
    dragged.plotY = dropY;
    dragged.dragOffset = {
        x: nudge.x / series.layoutScale,
        y: nudge.y / series.layoutScale
    };

    chart.redraw(false);

    assert.close(
        node('Cancel').plotX, dropX, 0.01,
        'Recording and replaying a drag at one size should not move the node'
    );
    assert.close(
        node('Cancel').plotY, dropY, 0.01,
        'The same for the Y position'
    );

    const before = {
        x: node('Cancel').plotX,
        y: node('Cancel').plotY
    };

    // The invariant: mapped back out of the plot area and measured against
    // where the layout currently puts the node, a drag has to come back as the
    // displacement it was recorded as - whatever the plot area is doing, and
    // whatever the fit has since done to the spacing.
    //
    // Two earlier revisions failed this. As a fraction of the plot area a drag
    // could not move on the axis that had not changed, and moved the wrong
    // distance on the one that had. As an absolute layout position it held
    // still while the gaps closed up around it, since closing them moves every
    // laid out node within the layout's own frame.
    //
    // The last two sizes below force the gaps to tighten, which is the case
    // that distinguishes a displacement from a position.
    [[820, 640], [450, 640], [1200, 900], [900, 320], [450, 320]]
        .forEach(function (size) {
            chart.setSize(size[0], size[1], false);

            const moved = node('Cancel'),
                origin = series.layoutOrigin,
                scale = series.layoutScale,
                base = series.layoutPositions.Cancel,
                label = size[0] + 'x' + size[1];

            assert.close(
                (moved.plotX - origin.x) / scale - base.x,
                dragged.dragOffset.x,
                0.01,
                'Drag holds its displacement from the layout at ' + label
            );
            assert.close(
                (moved.plotY - origin.y) / scale - base.y,
                dragged.dragOffset.y,
                0.01,
                'The same for Y at ' + label
            );
        });

    // The symptom this fixes: changing only the height used to leave a dragged
    // node's X untouched while every other node shifted, because the diagram is
    // rescaled and re-centered on both axes when either one binds.
    chart.setSize(900, 320, false);

    assert.ok(
        series.layoutScale < 1,
        'Halving the height should put the diagram into the shrink stage'
    );

    assert.notEqual(
        Math.round(node('Cancel').plotX),
        Math.round(before.x),
        'A dragged node moves on the unchanged axis too, as the diagram does'
    );
});

QUnit.test('Flowchart fit counts dragged nodes as content', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: { type: 'flowchart', width: 900, height: 600 },
        series: [{
            data: [
                ['Start', 'Read input'], ['Read input', 'Prepare'],
                ['Prepare', 'Valid?'], ['Valid?', 'Look up', 'Yes'],
                ['Valid?', 'Report', 'No'], ['Look up', 'Store'],
                ['Store', 'Report'], ['Report', 'End']
            ],
            nodes: [
                { id: 'Start', shape: 'oval' },
                { id: 'Valid?', shape: 'diamond' },
                {
                    id: 'Look up',
                    shape: 'subroutine',
                    name: 'Look up in registry'
                },
                { id: 'Store', shape: 'cylinder', name: 'Store result' },
                { id: 'End' }
            ]
        }]
    });

    const series = chart.series[0],
        node = id => series.nodes.find(n => n.id === id),
        outsidePlot = () => {
            let over = 0;
            series.nodes.forEach(function (n) {
                over = Math.max(
                    over,
                    -(n.plotX - n.shapeWidth / 2),
                    (n.plotX + n.shapeWidth / 2) - chart.plotWidth,
                    -(n.plotY - n.shapeHeight / 2),
                    (n.plotY + n.shapeHeight / 2) - chart.plotHeight
                );
            });
            return over;
        };

    // Drag a node as far right as the plot area allows. That puts it well
    // outside the layout's own box, which is the case the fit used to miss: it
    // sized the diagram from the layout alone, so on a narrower chart the node
    // was left hanging over the edge and clipped out of sight.
    const dragged = node('Store'),
        dropX = chart.plotWidth - dragged.shapeWidth / 2 - 2,
        dropped = series.toLayoutPosition({ x: dropX, y: dragged.plotY }),
        base = series.layoutPositions.Store;

    dragged.dragOffset = {
        x: dropped.x - base.x,
        y: dropped.y - base.y
    };
    chart.redraw(false);

    assert.close(
        outsidePlot(), 0, 0.5,
        'The dragged node should sit inside the plot area to begin with'
    );

    [[700, 600], [560, 600], [450, 600], [375, 600], [320, 600], [900, 320]]
        .forEach(function (size) {
            chart.setSize(size[0], size[1], false);

            const label = size[0] + 'x' + size[1];

            assert.ok(
                outsidePlot() <= 0.5,
                'A node dragged to the edge stays in view at ' + label +
                ' (outside by ' + outsidePlot().toFixed(1) + ')'
            );

            // Staying in view is only meaningful if the drag is still being
            // applied - the layout on its own always fits, so a node that had
            // quietly snapped back to its laid out place would pass the check
            // above without proving anything.
            assert.ok(
                node('Store').plotX > chart.plotWidth * 0.6,
                'The drag is still applied at ' + label +
                ' (x ' + node('Store').plotX.toFixed(0) + ' of ' +
                Math.round(chart.plotWidth) + ')'
            );
        });

    // Dragging a node clear of the layout widens the content, so the diagram
    // has to shrink sooner than the layout alone would have needed to.
    chart.setSize(450, 600, false);
    const withDrag = series.layoutScale;

    delete dragged.dragOffset;
    // `chart.redraw()` only re-runs a series when something marked it dirty,
    // and removing an override by hand does not.
    series.isDirty = true;
    chart.redraw(false);

    assert.ok(
        series.layoutScale > withDrag,
        'Removing the drag should let the diagram grow back (' +
        withDrag.toFixed(3) + ' -> ' + series.layoutScale.toFixed(3) + ')'
    );
});

QUnit.test('Flowchart fits each axis independently', function (assert) {
    // Long labels and mixed shapes, so width is what a narrow chart runs out
    // of first - which is the case where the two axes used to be tied
    // together.
    const chart = Highcharts.chart('container', {
        chart: { type: 'flowchart', width: 900, height: 640 },
        series: [{
            nodes: [
                { id: 'Start', shape: 'oval' },
                {
                    id: 'Receive',
                    shape: 'parallelogram',
                    name: 'Receive order'
                },
                { id: 'Stock', shape: 'cylinder', name: 'Check inventory' },
                { id: 'InStock', shape: 'diamond', name: 'In stock?' },
                { id: 'Backorder', shape: 'hexagon', name: 'Backorder item' },
                { id: 'Pay', shape: 'subroutine', name: 'Process payment' },
                { id: 'PayOk', shape: 'diamond', name: 'Payment valid?' },
                { id: 'Retry', name: 'Request retry' },
                { id: 'Cancel', name: 'Cancel order' },
                { id: 'Ship', name: 'Ship item' },
                { id: 'Notify', shape: 'document', name: 'Notify customer' },
                { id: 'End', shape: 'oval', name: 'Order closed' }
            ],
            data: [
                ['Start', 'Receive'], ['Receive', 'Stock'],
                ['Stock', 'InStock'], ['InStock', 'Pay', 'Yes'],
                ['InStock', 'Backorder', 'No'],
                ['Backorder', 'Stock', 'Restocked'],
                ['Backorder', 'Cancel', 'Unable'], ['Pay', 'PayOk'],
                ['PayOk', 'Ship', 'Yes'], ['PayOk', 'Retry', 'No'],
                ['Retry', 'Pay', 'Retry'], ['Retry', 'Cancel', 'Give up'],
                ['Cancel', 'End'], ['Ship', 'Notify'], ['Notify', 'End']
            ]
        }]
    });

    const series = chart.series[0],
        node = id => series.nodes.find(n => n.id === id),
        // How much of each axis the drawn diagram covers, the narrowest gap in
        // each direction, and how far anything reaches outside the plot area.
        measure = () => {
            let x0 = Infinity,
                y0 = Infinity,
                x1 = -Infinity,
                y1 = -Infinity;

            const rows = {};

            series.nodes.forEach(function (n) {
                x0 = Math.min(x0, n.plotX - n.shapeWidth / 2);
                x1 = Math.max(x1, n.plotX + n.shapeWidth / 2);
                y0 = Math.min(y0, n.plotY - n.shapeHeight / 2);
                y1 = Math.max(y1, n.plotY + n.shapeHeight / 2);
                (rows[Math.round(n.plotY)] =
                    rows[Math.round(n.plotY)] || []).push(n);
            });

            const over = Math.max(
                    -x0, x1 - chart.plotWidth, -y0, y1 - chart.plotHeight
                ),
                keys = Object.keys(rows).map(Number).sort((a, b) => a - b);

            let gapX = Infinity,
                gapY = Infinity;

            keys.forEach(function (k) {
                const row = rows[k].slice().sort((a, b) => a.plotX - b.plotX);
                for (let i = 0; i < row.length - 1; i++) {
                    gapX = Math.min(
                        gapX,
                        (row[i + 1].plotX - row[i + 1].shapeWidth / 2) -
                        (row[i].plotX + row[i].shapeWidth / 2)
                    );
                }
            });

            for (let i = 0; i < keys.length - 1; i++) {
                const below = Math.max(
                        ...rows[keys[i]].map(n => n.plotY + n.shapeHeight / 2)
                    ),
                    above = Math.min(
                        ...rows[keys[i + 1]]
                            .map(n => n.plotY - n.shapeHeight / 2)
                    );
                gapY = Math.min(gapY, above - below);
            }

            return {
                gapX: gapX,
                gapY: gapY,
                over: over,
                usedX: (x1 - x0) / chart.plotWidth,
                usedY: (y1 - y0) / chart.plotHeight
            };
        },
        // One tspan per rendered line, doubled by the label's text outline -
        // so this is only ever compared against itself at another size.
        lines = id => node(id).dataLabel.element
            .getElementsByTagName('tspan').length;

    const base = measure();

    assert.ok(
        base.usedX > 0.9 && base.usedY > 0.9,
        'The diagram fills both axes at its design size (' +
        base.usedX.toFixed(2) + ' x ' + base.usedY.toFixed(2) + ')'
    );

    assert.strictEqual(
        series.labelWidth,
        void 0,
        'A chart with room to spare leaves labels at their natural width'
    );

    const baseLines = lines('PayOk'),
        // Recorded at the design size, where nothing is scaled.
        baseBox = {
            height: node('PayOk').shapeHeight,
            width: node('PayOk').shapeWidth
        };

    // Halving the width must not cost the diagram its height. Under a single
    // shrink factor it did: at 450px the diagram covered 44% of the height it
    // had, because narrowing the chart scaled it down vertically too.
    chart.setSize(450, 640, false);
    const narrow = measure();

    assert.ok(
        narrow.usedY > 0.9,
        'Halving the width keeps the height filled (' +
        narrow.usedY.toFixed(2) + ')'
    );

    assert.ok(
        narrow.over <= 0.5,
        'Nothing reaches outside the plot area when narrowed (' +
        narrow.over.toFixed(1) + ')'
    );

    // What pays for the width is wrapping the labels, and the wrap has to
    // reach the rendered label - not just the measurement the boxes were sized
    // from, or the text would spill out of the shape holding it.
    assert.ok(
        series.labelWidth > 0,
        'A narrow chart wraps node labels (cap ' + series.labelWidth + ')'
    );

    assert.ok(
        lines('PayOk') > baseLines,
        'The rendered label wraps onto more lines than at full width (' +
        baseLines + ' -> ' + lines('PayOk') + ')'
    );

    // The trade wrapping makes, with the shrink factor divided back out so the
    // two sizes are comparable: the box gives up width and takes on height.
    const scale = series.layoutScale,
        wrapped = {
            height: node('PayOk').shapeHeight / scale,
            width: node('PayOk').shapeWidth / scale
        };

    assert.ok(
        wrapped.width < baseBox.width,
        'A wrapped node is narrower than the same node unwrapped (' +
        baseBox.width.toFixed(0) + ' -> ' + wrapped.width.toFixed(0) + ')'
    );

    assert.ok(
        wrapped.height > baseBox.height,
        'And taller, which is the height the width was bought with (' +
        baseBox.height.toFixed(0) + ' -> ' + wrapped.height.toFixed(0) + ')'
    );

    // ... and the mirror image: halving the height must not cost it its width.
    // Less of the width is recoverable here, because a gap may only grow to a
    // multiple of the node height before the diagram reads as strung out, so
    // what is left over stays as margin.
    chart.setSize(900, 320, false);
    const short = measure();

    assert.ok(
        short.usedX > 0.65,
        'Halving the height keeps most of the width filled (' +
        short.usedX.toFixed(2) + ')'
    );

    assert.ok(
        short.over <= 0.5,
        'Nothing reaches outside the plot area when shortened (' +
        short.over.toFixed(1) + ')'
    );

    // The two gaps are free to move in opposite directions at the same time,
    // which is the whole point: this chart is short of width and has height to
    // spare, so it closes up within a layer while opening up between layers.
    chart.setSize(700, 640, false);
    const mixed = measure();

    assert.ok(
        mixed.gapY > mixed.gapX + 5,
        'A narrow, tall chart tightens across and spreads down (gap x ' +
        mixed.gapX.toFixed(1) + ', gap y ' + mixed.gapY.toFixed(1) + ')'
    );

    // And the reverse, on the same data.
    chart.setSize(900, 380, false);
    const flat = measure();

    assert.ok(
        flat.gapX > flat.gapY + 5,
        'A wide, short chart tightens down and spreads across (gap x ' +
        flat.gapX.toFixed(1) + ', gap y ' + flat.gapY.toFixed(1) + ')'
    );
});
