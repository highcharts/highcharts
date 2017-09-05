QUnit.test('Undefined value (#6589)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        series: [{
            data: [{
                name: 'Microsoft Internet Explorer',
                y: 56.33
            }, {
                name: 'Chrome',
                y: 24.03,
                sliced: true,
                selected: true
            }, {
                name: 'Firefox',
                y: 10.38
            }, {
                name: 'Safari',
                y: 4.77
            }, {
                name: 'Opera',
                y: 0.91
            }, {
                name: 'Proprietary or Undetectable',
                y: 0.2
            }, {
                name: 'Pipoca',
                y: undefined
            }]
        }]
    });

    var box = chart.series[0].points[0].graphic.getBBox();
    assert.ok(
        box.width > 50,
        'Box width OK'
    );
    assert.ok(
        box.height > 50,
        'Box height OK'
    );

});

QUnit.test('Update to negative (#7113)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        series: [{
            data: [10, 10, 10]
            //data: [-10, -10, -10]
        }]
    });

    // Issue #7113
    chart.series[0].setData([-10, -10, -10]);
    assert.strictEqual(
        chart.series[0].points[0].graphic,
        null,
        'Graphic is removed'
    );
    assert.strictEqual(
        chart.series[0].group.element.childNodes.length,
        0,
        'No remaining graphics'
    );
});
