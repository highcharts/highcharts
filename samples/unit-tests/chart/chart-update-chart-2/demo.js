/* eslint func-style:0 */


QUnit.test('Option chart plot border and background update', function (assert) {
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

    var testimage = (location.host === 'localhost:9876') ?
        'base/test/testimage.png' : // karma
        'testimage.png'; // utils

    chart.update({
        chart: {
            plotBackgroundColor: '#effecc',
            plotBackgroundImage: testimage,
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
        testimage,
        'Image attempted loaded'
    );
});

QUnit.test('Option chart.ignoreHiddenSeries update', function (assert) {

    var cfg = {
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

    cfg.series[0].data[0] = 100; // Add a spike to test ignoreHiddenSeries
    cfg.series[0].visible = false;

    var chart = Highcharts.chart('container', cfg);

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

QUnit.test('Option chart.spacing update', function (assert) {
    var chart = Highcharts.chart('container', Highcharts.merge({
        chart: {
            plotBackgroundColor: 'silver'
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
