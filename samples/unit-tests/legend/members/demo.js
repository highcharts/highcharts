QUnit.test('Legend.renderItem', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                className: 'className'
            }]
        }),
        element = chart.legend.allItems[0].group.element,
        classNames = element.getAttribute('class').split(' ');

    assert.strictEqual(
        classNames.indexOf('highcharts-line-series') > -1,
        true,
        'className for series type is added.'
    );
    assert.strictEqual(
        classNames.indexOf('highcharts-color-0') > -1,
        true,
        'className for color is added.'
    );
    assert.strictEqual(
        classNames.indexOf('className') > -1,
        true,
        'className for series.className is added.'
    );
    assert.strictEqual(
        classNames.indexOf('highcharts-series-0') > -1,
        true,
        'className for series index is added.'
    );
});

QUnit.test('Legend.update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        series: [{
            data: [1, 3, 2, 4],
            spacingRight: 10,
            animation: false
        }],
        legend: {
            align: 'right',
            verticalAlign: 'middle'
        }
    });

    assert.notEqual(
        chart.marginRight,
        10,
        'Margin has room for legend'
    );

    chart.update({
        legend: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.marginRight,
        10,
        'Legend is hidden'
    );
});

QUnit.test('Color axis', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'heatmap',
            width: 600
        },


        title: {
            text: 'Legend update'
        },

        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0],
            tickWidth: 10,
            tickColor: 'red',
            gridLineColor: 'blue',
            gridLineWidth: 2,
            tickInterval: 1
        },

        series: [{
            data: [
                [1, 2, 3],
                [2, 3, 4],
                [3, 4, 5],
                [4, 5, 6]
            ]
        }]

    });

    assert.strictEqual(
        document.querySelector('.highcharts-legend').textContent,
        '0123456',
        'Labels are there after update (#6888)'
    );

    chart.legend.update({
        symbolWidth: 300
    });

    assert.strictEqual(
        document.querySelector('.highcharts-legend').textContent,
        '0123456',
        'Labels are still there after update (#6888)'
    );

    var controller = new TestController(chart);

    controller.mouseOver(
        chart.legend.group.translateX + 10,
        chart.legend.group.translateY + 10
    );
    assert.notEqual(
        chart.container.querySelector('.highcharts-root')
            .className.baseVal
            .indexOf('highcharts-legend-series-active'),
        -1,
        'Chart should be in series hover mode (#7406)'
    );
    assert.notEqual(
        chart.container.querySelector('.highcharts-series-0')
            .className.baseVal
            .indexOf('highcharts-series-hover'),
        -1,
        'Series should be in hover state (#7406)'
    );
});

QUnit.test('Legend.title renders after update', function (assert) {
    var config = {
            legend: {
                enabled: true,
                title: {
                    text: 'Hello World'
                }
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        },
        chart = Highcharts.chart('container', config);
    var called = false;
    chart.legend.title.destroy = (function (fn) {
        return function () {
            called = true;
            return fn.apply(this, arguments);
        };
    }(chart.legend.title.destroy));

    chart.update(config);

    assert.ok(
        called
    );

    assert.ok(
        chart.legend.title.text,
        'Legend title exists after update.'
    );
});
