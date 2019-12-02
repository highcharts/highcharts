QUnit.test('ignoreNulls', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'column'
        },

        xAxis: [{

        }, {

        }],

        yAxis: [{

        }, {
            opposite: true,
            title: null
        }],

        series: [{
            name: 'Tokyo',
            data: [
                [0, 2],
                [1, 3],
                [2, 2],
                [3, null]
            ]
        }, {
            name: 'Warsaw',
            data: [
                [0, null],
                [1, 5],
                [2, 1]
            ]
        }, {
            name: 'Madrid',
            data: [
                [0, null],
                [1, 3]
            ]
        }, {
            name: 'Another',
            data: [
                [0, 1],
                [1, 2],
                [3, 4]
            ]
        }]

    });

    assert.strictEqual(
        chart.series[3].points[0].shapeArgs.width,
        15,
        '(ignoreNulls: false) - point\'s width is ok.'
    );

    assert.strictEqual(
        chart.yAxis[0].maxColumnCount,
        undefined,
        '(ignoreNulls: false) - yAxis.maxColumnCount should not be calculated.'
    );

    assert.strictEqual(
        chart.yAxis[0].minColumnWidth,
        undefined,
        '(ignoreNulls: false) - yAxis.minColumnWidth should not be calculated.'
    );

    chart.update({
        plotOptions: {
            series: {
                ignoreNulls: 'normal'
            }
        }
    });

    assert.strictEqual(
        chart.series[1].points[2].shapeArgs.x + chart.plotLeft >
            chart.xAxis[0].ticks[2].mark.element.getBBox().x,
        true,
        'Point should be on the right side of the tick.'
    );

    assert.strictEqual(
        chart.series[3].points[0].shapeArgs.width,
        15,
        '(ignoreNulls: \'normal\') - point\'s width is ok.'
    );

    assert.strictEqual(
        chart.yAxis[0].maxColumnCount,
        4,
        '(ignoreNulls: \'normal\') - yAxis.maxColumnCount is ok.'
    );

    assert.strictEqual(
        chart.yAxis[0].minColumnWidth,
        15,
        '(ignoreNulls: \'normal\') - yAxis.minColumnWidth is ok.'
    );

    chart.update({
        plotOptions: {
            series: {
                ignoreNulls: 'evenlySpaced'
            }
        }
    });

    assert.strictEqual(
        chart.series[3].points[0].shapeArgs.width,
        15,
        '(ignoreNulls: \'evenlySpaced\') - point\'s width is ok.'
    );

    assert.strictEqual(
        chart.yAxis[0].minColumnWidth,
        15,
        '(ignoreNulls: \'evenlySpaced\') - yAxis.minColumnWidth is ok.'
    );

    assert.strictEqual(
        chart.yAxis[0].maxColumnCount,
        undefined,
        '(ignoreNulls: \'evenlySpaced\') - yAxis.maxColumnCount should not be calculated.'
    );

    chart.update({
        plotOptions: {
            series: {
                ignoreNulls: 'fillSpace'
            }
        }
    });

    assert.strictEqual(
        chart.series[3].points[0].shapeArgs.width,
        31,
        '(ignoreNulls: \'fillSpace\') - point\'s width is ok.'
    );

    assert.strictEqual(
        chart.yAxis[0].maxColumnCount,
        undefined,
        '(ignoreNulls: \'fillSpace\') - yAxis.maxColumnCount should not be calculated.'
    );

    assert.strictEqual(
        chart.yAxis[0].minColumnWidth,
        undefined,
        '(ignoreNulls: \'fillSpace\') - yAxis.minColumnWidth should not be calculated.'
    );

    chart.series[1].setData([
        [0, null],
        [1, null],
        [1, 5],
        [1, null],
        [2, 1]
    ]);

    assert.notEqual(
        chart.series[1].points[1].shapeArgs.x,
        chart.series[2].points[1].shapeArgs.x,
        'Nulls and value with the same x coordinates should be handled properly.'
    );

    chart.series[0].update({
        xAxis: 1,
        yAxis: 1
    }, false);

    chart.series[1].update({
        xAxis: 1,
        yAxis: 1
    }, false);

    chart.xAxis[0].update({
        width: '50%'
    }, false);

    chart.xAxis[1].update({
        width: '50%',
        left: '50%',
        offset: 0
    }, false);

    chart.redraw();

    assert.strictEqual(
        chart.series[1].points[1].shapeArgs.x + chart.plotLeft + chart.plotSizeX / 2 >
            chart.xAxis[1].ticks[1].mark.element.getBBox().x,
        true,
        'ignoreNulls works for multiple x-axes.'
    );

    chart.update({
        plotOptions: {
            series: {
                ignoreNulls: 'normal'
            }
        }
    });

    assert.strictEqual(
        chart.yAxis[1].maxColumnCount,
        2,
        'yAxis.maxColumnCount works for multiple y-axes.'
    );

    assert.strictEqual(
        chart.yAxis[1].minColumnWidth,
        14,
        'yAxis.maxColumnCount works for multiple y-axes.'
    );

    chart.update({
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        }
    }, false);

    chart.series[2].update({
        stack: 1
    }, false);

    chart.redraw();

    assert.strictEqual(
        chart.yAxis[0].stacks['column,1,,50%'][1].label.absoluteBox.x <
            chart.xAxis[0].ticks[1].mark.element.getBBox().x,
        true,
        'stackLabels should be in a correct place.'
    );

    const inheritedMethods = [
        'addPoint',
        'correctStackLabels',
        'crispCol',
        'drawPoints',
        'drawTracker',
        'getMaxColumnCount',
        'getMinColumnWidth',
        'getColumnCount',
        'getColumnMetrics',
        'hasValueInX',
        'pointAttribs',
        'animate',
        'polarArc',
        'translate3dPoints',
        'translate3dShapes'
    ];

    inheritedMethods.forEach(methodName => {
        assert.notEqual(
            Highcharts.seriesTypes.column.prototype[methodName],
            Highcharts.seriesTypes.columnrange.prototype[methodName],
            'Inherited methods should not be the same.'
        );
    });

});