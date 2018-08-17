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
            'exists': [0]
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
            drillToNode: function (id) {
                this.rootNode = id;
            },
            nodeMap: {
                '': {},
                'A': { parent: '' }
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

QUnit.test('seriesTypes.treemap.drillToNode', function (assert) {
    var drillToNode = Highcharts.seriesTypes.treemap.prototype.drillToNode,
        series = {
            chart: {
                redraw: function () {
                    this.redrawed = true;
                }
            },
            nodeMap: {
                '': {},
                'A': { parent: '' }
            },
            drillUpButton: {
                name: undefined,
                destroy: function () {
                    this.name = undefined;
                    return this;
                }
            },
            showDrillUpButton: function (name) {
                this.drillUpButton.name = name;
            }
        };
    drillToNode.call(series, 'A');
    assert.strictEqual(
        series.rootNode,
        'A',
        'Drill to A: Root node updated'
    );
    assert.strictEqual(
        series.drillUpButton.name,
        'A',
        'Drill to A: drill up button displayed'
    );
    assert.strictEqual(
        series.chart.redrawed,
        true,
        'Drill to A: do redraw by default'
    );

    series.chart.redrawed = undefined;
    drillToNode.call(series, '', false);
    assert.strictEqual(
        series.rootNode,
        '',
        'Drill to \'\': Root node updated'
    );
    assert.strictEqual(
        series.drillUpButton.name,
        undefined,
        'Drill to \'\': drill up button destroyed'
    );
    assert.strictEqual(
        series.chart.redrawed,
        undefined,
        'Drill to \'\': Redraw false'
    );
});

QUnit.test('seriesTypes.treemap.onClickDrillToNode', function (assert) {
    var onClickDrillToNode = Highcharts.seriesTypes.treemap.prototype.onClickDrillToNode,
        series = {
            drillToNode: function (id) {
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
