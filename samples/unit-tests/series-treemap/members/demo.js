QUnit.test("Axis extremes should be reset after updated data. (#4298)", function (assert) {
    var chart = $('#container').highcharts({
            series: [{
                type: "treemap",
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                data: [{
                    id: "A"
                }, {
                    id: "B",
                    value: 2
                }, {
                    id: "A1",
                    parent: "A",
                    value: 1
                }]
            }]
        }).highcharts(),
        series = chart.series[0],
        extremesX,
        extremesY,
        root;

    // Actions
    series.drillToNode("A");
    series.addPoint({
        id: "A2",
        parent: "A",
        value: 1
    });
    root = series.nodeMap[series.rootNode].pointValues;
    extremesX = series.xAxis.getExtremes();
    extremesY = series.yAxis.getExtremes();

    // Tests
    assert.strictEqual(series.rootNode, "A", "Root node is updated to A");
    assert.strictEqual(root.x, extremesX.min, "xAxis.min equals root.x");
    assert.strictEqual(root.x + root.width, extremesX.max, "xAxis.max equals root.x + root.width");
    assert.strictEqual(root.y, extremesY.min, "yAxis.min equals root.y");
    assert.strictEqual(root.y + root.height, extremesY.max, "yAxis.max equals root.y + root.height");
});

QUnit.test('directTouch', function (assert) {
    var treemapSeries = Highcharts.seriesTypes.treemap;
    assert.strictEqual(
        treemapSeries.prototype.directTouch,
        true,
        'directTouch should default to true.'
    );
});

QUnit.test('getListOfParents', function (assert) {
    var series = Highcharts.seriesTypes.treemap,
        getListOfParents = series.prototype.getListOfParents;

    assert.deepEqual(
        getListOfParents(),
        {
            '': []
        },
        'should return map with only root node when no parameters are provided.'
    );

    assert.deepEqual(
        getListOfParents(true, ['random-id']),
        {
            '': []
        },
        'should return map with only root node when data is invalid.'
    );

    assert.deepEqual(
        getListOfParents([{ parent: 'non-existing' }], true),
        {
            '': [0]
        },
        'should hoist all points to root node if existingIds is invalid.'
    );

    assert.deepEqual(
        getListOfParents([{ parent: 'non-existing' }], ['exists']),
        {
            '': [0]
        },
        'should hoist point to root node if parent does not exist.'
    );

    assert.deepEqual(
        getListOfParents([{ parent: 'exists' }], ['exists']),
        {
            '': [],
            exists: [0]
        },
        'should add point under parent when it exists.'
    );
});

QUnit.test('seriesTypes.treemap.pointClass.setState', function (assert) {
    var series = Highcharts.seriesTypes.treemap,
        setState = series.prototype.pointClass.prototype.setState,
        pointAttribs = series.prototype.pointAttribs,
        noop = Highcharts.noop,
        point = {
            node: {},
            graphic: {
                animate: noop,
                attr: function (obj) {
                    var graphic = this,
                        keys = Object.keys(obj);
                    keys.forEach(function (key) {
                        var value = obj[key];
                        graphic[key] = value;
                    });
                },
                addClass: noop,
                removeClass: noop
            },
            getClassName: function () {
                return '';
            },
            series: {
                chart: {
                    options: {
                        chart: {}
                    }
                },
                type: 'treemap',
                options: {
                    states: {
                        hover: {},
                        select: {}
                    }
                },
                pointAttribs: pointAttribs,
                zones: []
            }
        };
    setState.call(point, '');
    assert.strictEqual(
        point.graphic.zIndex,
        0,
        'When state:normal zIndex is 0'
    );
    setState.call(point, 'hover');
    assert.strictEqual(
        point.graphic.zIndex,
        1,
        'When state:hover zIndex is 1'
    );
    setState.call(point, 'select');
    assert.strictEqual(
        point.graphic.zIndex,
        0,
        'When state:select zIndex is 0'
    );
});

QUnit.test('seriesTypes.treemap.drillUp', function (assert) {
    var drillUp = Highcharts.seriesTypes.treemap.prototype.drillUp,
        series = {
            rootNode: '',
            setRootNode: function (id) {
                this.rootNode = id;
            },
            nodeMap: {
                '': {},
                A: { parent: '' }
            }
        };
    drillUp.call(series);
    assert.strictEqual(
        series.rootNode,
        '',
        'Do not drill up when root node does not have a parent'
    );

    series.rootNode = 'B';
    drillUp.call(series);
    assert.strictEqual(
        series.rootNode,
        'B',
        'Do not drill when root node does not exist'
    );

    series.rootNode = 'A';
    drillUp.call(series);
    assert.strictEqual(
        series.rootNode,
        '',
        'Drill to parent'
    );
});

QUnit.module('setRootNode', () => {
    const { setRootNode } = Highcharts.seriesTypes.treemap.prototype;
    const { merge } = Highcharts;
    const seriesDefault = {
        chart: {
            redraw: function () {
                this.redrawed = true;
            }
        },
        nodeMap: {
            '': {},
            A: { parent: '', name: 'A' }
        },
        rootNode: ''
    };

    QUnit.test('should set property rootNode on the series.', assert => {
        const series = merge({}, seriesDefault);
        setRootNode.call(series, 'A');
        assert.strictEqual(
            series.rootNode,
            'A',
            'Drill to A: Root node updated'
        );
        assert.strictEqual(
            series.chart.redrawed,
            true,
            'Drill to A: do redraw by default'
        );

        series.chart.redrawed = undefined;
        setRootNode.call(series, '', false);
        assert.strictEqual(
            series.rootNode,
            '',
            'Drill to \'\': Root node updated'
        );
        assert.strictEqual(
            series.chart.redrawed,
            undefined,
            'Drill to \'\': Redraw false'
        );

        setRootNode.call(series, 'A');
    });

    QUnit.test('should pass along arguments to the event', assert => {
        const series = merge({}, seriesDefault);
        const { addEvent } = Highcharts;

        addEvent(series, 'setRootNode', eventArguments => {
            assert.strictEqual(
                eventArguments.newRootId,
                'A',
                'expect eventArguments.newRootId to equal "A".'
            );
            assert.strictEqual(
                eventArguments.previousRootId,
                '',
                'expect eventArguments.previousRootId to equal "".'
            );
            assert.strictEqual(
                eventArguments.redraw,
                true,
                'expect eventArguments.redraw to equal true.'
            );
            assert.strictEqual(
                eventArguments.series === series,
                true,
                'expect eventArguments.series to reference context of setRootNode call.'
            );
            assert.strictEqual(
                eventArguments.trigger,
                'test',
                'expect eventArguments.trigger to equal "test".'
            );
        });

        setRootNode.call(series, 'A', undefined, { trigger: 'test' });
    });
});

QUnit.test('seriesTypes.treemap.onClickDrillToNode', function (assert) {
    var onClickDrillToNode = Highcharts.seriesTypes.treemap.prototype.onClickDrillToNode,
        series = {
            setRootNode: function (id) {
                this.rootNode = id;
            }
        },
        point = {
            setState: function (state) {
                this.state = state;
            }
        };

    onClickDrillToNode(series, {});
    assert.strictEqual(
        series.rootNode,
        undefined,
        'Do not drill if point is undefined.'
    );

    onClickDrillToNode(series, { point: point });
    assert.strictEqual(
        series.rootNode,
        undefined,
        'Do not drill if point.drillId is undefined.'
    );

    point.drillId = '';
    onClickDrillToNode.call(series, { point: point });
    assert.strictEqual(
        series.rootNode,
        '',
        'On click drill to \'\': rootNode is updated.'
    );
    assert.strictEqual(
        point.state,
        '',
        'On click drill to \'\': point.state is updated.'
    );
});

QUnit.test('traverseUpButton', assert => {
    const { treemap: options } = Highcharts.defaultOptions.plotOptions;
    const { renderTraverseUpButton } = Highcharts.seriesTypes.treemap.prototype;
    const { SVGRenderer } = Highcharts;
    const container = document.getElementById('container');
    const renderer = new SVGRenderer(
        container,
        200,
        200
    );
    const series = {
        chart: { renderer: renderer },
        nodeMap: {
            '': {},
            A: { parent: '', name: 'A' }
        },
        options: options
    };
    const after = () => {
        container.removeChild(renderer.box);
        renderer.destroy();
        delete series.options.traverseUpButton.text;
    };

    // Render button when root id is ''
    renderTraverseUpButton.call(series, '');
    assert.strictEqual(
        series.drillUpButton,
        undefined,
        'should destroy traverseUpButton when root id is \'\'.'
    );

    // Render button when root id is 'A'
    renderTraverseUpButton.call(series, 'A');
    assert.strictEqual(
        series.drillUpButton.text.textStr,
        'A',
        'should set name to "A" when root is "A" and traverseUpButton.text is undefined.'
    );

    // Render button with custom text
    series.options.traverseUpButton.text = 'My Custom Text';
    renderTraverseUpButton.call(series, 'A');
    assert.strictEqual(
        series.drillUpButton.text.textStr,
        'My Custom Text',
        'should set name to "My Custom Text" when traverseUpButton.text is set to "My Custom Text".'
    );

    // Clean up after the tests
    after();
});
