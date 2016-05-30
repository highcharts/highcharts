/* eslint func-style:0 */
$(function () {

    var config = {
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
    };

    var stockConfig = {
        chart: {
            animation: false,
            height: 300,
            plotBackgroundColor: '#eff'
        },

        series: [{
            animation: false,
            pointStart: Date.UTC(2016, 0, 1),
            pointInterval: 24 * 36e5,
            data: [1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2]
        }]
    };

    QUnit.test('Option chart.alignTicks update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], {

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
    });

    QUnit.test('Option chart.animation update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
            chart.chartBackground.element.getAttribute('fill'),
            '#FFFFFF',
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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], Highcharts.merge(config));

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], Highcharts.merge(config));

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
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], Highcharts.merge({
            chart: {
                plotBackgroundColor: 'silver'
            }
        }, config));

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

    QUnit.test('Option chart plot border and background update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], config);

        chart.update({
            chart: {
                plotBackgroundColor: '#effecc',
                plotBackgroundImage: '404.png',
                plotBorderColor: '#abbaca',
                plotBorderWidth: 10
            }
        });
        assert.strictEqual(
            chart.plotBackground.element.getAttribute('fill'),
            '#effecc',
            'Plot background is updated'
        );
        assert.strictEqual(
            chart.plotBorder.element.getAttribute('stroke'),
            '#abbaca',
            'Plot border is updated'
        );
        assert.strictEqual(
            chart.plotBorder.element.getAttribute('stroke-width'),
            '10',
            'Plot border width is updated'
        );
        assert.strictEqual(
            chart.plotBGImage.element.getAttribute('href'),
            '404.png',
            'Image attempted loaded'
        );
    });

    QUnit.test('Option chart.ignoreHiddenSeries update', function (assert) {

        var cfg = Highcharts.merge(config);

        cfg.series[0].data[0] = 100; // Add a spike to test ignoreHiddenSeries
        cfg.series[0].visible = false;

        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], cfg);

        assert.strictEqual(
            typeof chart.yAxis[0].max,
            'number',
            'Valid axis'
        );
        assert.ok(
            chart.yAxis[0].max < 10,
            'Small axis'
        );

        // Now series[0] should not be ignored, causing the y axis to make room for the 100 point
        chart.update({
            chart: {
                ignoreHiddenSeries: false
            }
        });

        assert.ok(
            chart.yAxis[0].max >= 100,
            'Make space for hidden series'
        );


    });

    QUnit.test('Option chart.polar update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], Highcharts.merge(config));

        assert.ok(
            !chart.polar,
            'Initially not polar'
        );

        assert.ok(
            !chart.xAxis[0].isRadial,
            'Axis not radial'
        );

        assert.ok(
            chart.series[0].points[0].graphic.element.getAttribute('d') === null,
            'Columns not arced'
        );


        // Make polar
        chart.update({
            chart: {
                polar: true
            }
        });

        assert.ok(
            chart.polar,
            'Now polar'
        );

        assert.ok(
            chart.xAxis[0].isRadial,
            'Axis is radial'
        );

        assert.ok(
            chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A') > -1,
            'Columns are arced'
        );
        assert.ok(
            chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[1]].gridLine.element.getAttribute('d').indexOf('A') > -1,
            'Grid lines are arced'
        );

        // Unmake polar
        chart.update({
            chart: {
                polar: false
            }
        });

        assert.ok(
            !chart.polar,
            'Not polar'
        );

        assert.ok(
            !chart.xAxis[0].isRadial,
            'Axis not radial'
        );

        assert.ok(
            chart.series[0].points[0].graphic.element.getAttribute('d') === null,
            'Columns not arced'
        );
        assert.ok(
            chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[1]].gridLine.element.getAttribute('d').indexOf('A') === -1,
            'Grid lines not arced'
        );

    });



    QUnit.test('Option chart.spacing update', function (assert) {
        var chart = Highcharts.chart($('<div>').appendTo('#container')[0], Highcharts.merge({
            chart: {
                plotBackgroundColor: 'silver'
            }
        }, config));

        // Test for integer
        chart.update({
            chart: {
                spacing: 50
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
                spacing: [75, 75, 75, 75]
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
                spacing: null,
                spacingTop: 100,
                spacingRight: 100,
                spacingBottom: 100,
                spacingLeft: 100
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
                spacing: [10, 10, 15, 10],
                spacingTop: undefined,
                spacingRight: undefined,
                spacingBottom: undefined,
                spacingLeft: undefined
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

    QUnit.test('Option chart.type update', function (assert) {
        var cfg = Highcharts.merge(config),
            chart;

        cfg.series[1].type = 'pie';
        chart = Highcharts.chart($('<div>').appendTo('#container')[0], cfg);

        assert.strictEqual(
            chart.series[0].type,
            'column',
            'Initially column'
        );
        assert.strictEqual(
            chart.series[0].points[0].graphic.element.nodeName,
            'rect',
            'Initially column'
        );

        // Second series is set to pie in series options
        assert.strictEqual(
            chart.series[1].type,
            'pie',
            'Initially pie'
        );
        assert.strictEqual(
            chart.series[1].points[0].graphic.element.nodeName,
            'path',
            'Initially pie'
        );

        // Update to pie
        chart.update({
            chart: {
                type: 'pie'
            }
        });

        assert.strictEqual(
            chart.series[0].type,
            'pie',
            'Changed to pie'
        );
        assert.strictEqual(
            chart.series[0].points[0].graphic.element.nodeName,
            'path',
            'Changed to pie'
        );
        assert.strictEqual(
            chart.series[1].type,
            'pie',
            'Still pie'
        );
        assert.strictEqual(
            chart.series[1].points[0].graphic.element.nodeName,
            'path',
            'Still pie'
        );

        // Update to line
        chart.update({
            chart: {
                type: 'line'
            }
        });

        assert.strictEqual(
            chart.series[0].type,
            'line',
            'Changed to line'
        );
        assert.strictEqual(
            chart.series[0].graph.element.nodeName,
            'path',
            'Changed to line'
        );
        assert.strictEqual(
            chart.series[1].type,
            'pie',
            'Still pie'
        );
        assert.strictEqual(
            chart.series[1].points[0].graphic.element.nodeName,
            'path',
            'Still pie'
        );
    });

    QUnit.test('Chart.update with with or height', function (assert) {
        var cfg = Highcharts.merge(config),
            chart;
        
        cfg.chart.width = 400;
        cfg.chart.height = 400;
        chart = Highcharts.chart($('<div>').appendTo('#container')[0], cfg);

        assert.strictEqual(
            chart.chartWidth,
            400,
            'Initial width'
        );
        assert.strictEqual(
            chart.chartHeight,
            400,
            'Initial height'
        );


        chart.update({
            chart: {
                width: 300,
                height: 300
            }
        });

        assert.strictEqual(
            chart.chartWidth,
            300,
            'New width'
        );
        assert.strictEqual(
            chart.chartHeight,
            300,
            'New height'
        );
    });
});
