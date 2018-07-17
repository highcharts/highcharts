/* eslint func-style:0 */


QUnit.test('Option chart.alignTicks update', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            alignTicks: false
        },

        yAxis: [{

        }, {
            opposite: true
        }],

        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [2, 4, 6],
            yAxis: 1
        }]

    });

    assert.notEqual(
        chart.yAxis[0].tickPositions.length,
        chart.yAxis[1].tickPositions.length,
        'Not aligned ticks'
    );

    chart.update({
        chart: {
            alignTicks: true
        }
    });

    assert.strictEqual(
        chart.yAxis[0].tickPositions.length,
        chart.yAxis[1].tickPositions.length,
        'Aligned ticks'
    );

    chart.update({
        chart: {
            alignTicks: false
        }
    });

    assert.notEqual(
        chart.yAxis[0].tickPositions.length,
        chart.yAxis[1].tickPositions.length,
        'Back to not aligned ticks (#6452)'
    );
});

QUnit.test('Option chart.animation update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    assert.strictEqual(
        chart.renderer.globalAnimation,
        undefined,
        'Undefined animation'
    );

    chart.update({
        chart: {
            animation: false
        }
    });

    assert.strictEqual(
        chart.renderer.globalAnimation,
        false,
        'Disabled animation'
    );

    chart.update({
        chart: {
            animation: true
        }
    });

    assert.strictEqual(
        chart.renderer.globalAnimation,
        true,
        'Enabled animation'
    );

});

QUnit.test('Option chart border and background update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    chart.update({
        chart: {
            backgroundColor: '#effecc',
            borderColor: '#abbaca',
            borderRadius: 10,
            borderWidth: 10
        }
    });
    assert.strictEqual(
        chart.chartBackground.element.getAttribute('fill'),
        '#effecc',
        'Chart background is updated'
    );
    assert.strictEqual(
        chart.chartBackground.element.getAttribute('stroke'),
        '#abbaca',
        'Chart border is updated'
    );
    assert.strictEqual(
        chart.chartBackground.element.getAttribute('stroke-width'),
        '10',
        'Chart border width is updated'
    );
    assert.strictEqual(
        chart.chartBackground.element.getAttribute('rx'),
        '10',
        'Chart border radius is updated'
    );

    // Back to default
    chart.update({
        chart: {
            backgroundColor: '#FFFFFF',
            borderColor: '#4572A7',
            borderRadius: 0,
            borderWidth: 0
        }
    });

    assert.strictEqual(
        chart.chartBackground.element.getAttribute('fill').toLowerCase(),
        '#ffffff',
        'Chart background is updated'
    );
    assert.strictEqual(
        chart.chartBackground.element.getAttribute('stroke'),
        null,
        'Chart border is removed'
    );
    assert.strictEqual(
        chart.chartBackground.element.getAttribute('rx'),
        '0',
        'Chart border radius is updated'
    );
});

QUnit.test('Option chart className update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    assert.ok(
        chart.container.className.indexOf('my-class') === -1,
        'Default class name'
    );

    chart.update({
        chart: {
            className: 'my-class'
        }
    });

    assert.ok(
        chart.container.className.indexOf('my-class') > -1,
        'Custom class name'
    );

});

QUnit.test('Option chart.inverted update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    assert.ok(
        !chart.inverted,
        'Initially not inverted'
    );

    assert.strictEqual(
        chart.xAxis[0].side,
        2,
        'Initially X axis on bottom'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    assert.ok(
        chart.inverted,
        'Chart is inverted'
    );

    assert.strictEqual(
        chart.xAxis[0].side,
        3,
        'X axis on left'
    );

    assert.strictEqual(
        chart.series[0].group.inverted,
        true,
        'Series is inverted (#5938)'
    );

    chart.update({
        chart: {
            inverted: false
        }
    });

    assert.ok(
        !chart.inverted,
        'Chart is not inverted'
    );

    assert.strictEqual(
        chart.xAxis[0].side,
        2,
        'X axis at the bottom'
    );
});

QUnit.test('Option chart.options3d update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'rect',
        '2D column'
    );

    chart.update({
        chart: {
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15
            }
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'g',
        '3D column'
    );


    chart.update({
        chart: {
            options3d: {
                enabled: false,
                alpha: 15,
                beta: 15
            }
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'rect',
        'Back to 2D column'
    );

});

QUnit.test('Option chart shadows update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    assert.ok(
        !chart.chartBackground.shadows,
        'Chart shadow does not exist'
    );

    assert.ok(
        !chart.plotBackground.shadows,
        'Plot shadow does not exist'
    );

    chart.update({
        chart: {
            plotShadow: true,
            shadow: true
        }
    });

    assert.ok(
        chart.chartBackground.shadows,
        'Chart shadow exists'
    );

    assert.ok(
        chart.plotBackground.shadows,
        'Plot shadow exists'
    );



    chart.update({
        chart: {
            plotShadow: false,
            shadow: false
        }
    });

    assert.ok(
        !chart.chartBackground.shadows,
        'Chart shadow does not exist'
    );

    assert.ok(
        !chart.plotBackground.shadows,
        'Plot shadow does not exist'
    );


});

QUnit.test('Option chart.margin update', function (assert) {
    var chart = Highcharts.chart('container', Highcharts.merge({
        chart: {
            plotBackgroundColor: 'silver',
            animation: false
        }
    }, {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    }));

    // Test for integer
    chart.update({
        chart: {
            margin: 50
        }
    });

    assert.ok(
        chart.plotBackground.getBBox().width <= chart.chartWidth - 100,
        'Plot area width ok'
    );

    assert.ok(
        chart.plotBackground.getBBox().height <= chart.chartHeight - 100,
        'Plot area height ok'
    );

    // Test for array
    chart.update({
        chart: {
            margin: [75, 75, 75, 75]
        }
    });

    assert.ok(
        chart.plotBackground.getBBox().width <= chart.chartWidth - 150,
        'Plot area width ok'
    );

    assert.ok(
        chart.plotBackground.getBBox().height <= chart.chartHeight - 150,
        'Plot area height ok'
    );


    // Test for unique names
    chart.update({
        chart: {
            margin: null,
            marginTop: 100,
            marginRight: 100,
            marginBottom: 100,
            marginLeft: 100
        }
    });

    assert.ok(
        chart.plotBackground.getBBox().width <= chart.chartWidth - 200,
        'Plot area width ok'
    );

    assert.ok(
        chart.plotBackground.getBBox().height <= chart.chartHeight - 200,
        'Plot area height ok'
    );

    // Reset
    chart.update({
        chart: {
            marginTop: undefined,
            marginRight: undefined,
            marginBottom: undefined,
            marginLeft: undefined
        }
    });

    assert.ok(
        chart.plotBackground.getBBox().width > chart.chartWidth - 200,
        'Plot area width ok'
    );

    assert.ok(
        chart.plotBackground.getBBox().height > chart.chartHeight - 200,
        'Plot area height ok'
    );
});
