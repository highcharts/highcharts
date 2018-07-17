QUnit.test('Undefined value (#6589)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            width: 600
        },
        series: [{
            animation: false,
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
            type: 'pie',
            width: 600
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

QUnit.test('Updating point visibility (#8428)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        series: [{
            id: 'brands',
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Chrome',
                y: 61.41,
                visible: false
            }, {
                name: 'Internet Explorer',
                y: 11.84
            }, {
                name: 'Firefox',
                y: 10.85
            }, {
                name: 'Edge',
                y: 4.67
            }, {
                name: 'Safari',
                y: 4.18
            }, {
                name: 'Sogou Explorer',
                y: 1.64
            }, {
                name: 'Opera',
                y: 1.6
            }, {
                name: 'QQ',
                y: 1.2
            }, {
                name: 'Other',
                y: 2.61
            }]
        }]
    });

    var point = chart.series[0].points[0];

    function isHidden(element) {
        return (
            element === undefined ||
            element.element.getAttribute('visibility') === 'hidden'
        );
    }

    assert.ok(
        isHidden(point.graphic),
        'Hidden point should not have a graphic'
    );
    assert.ok(
        isHidden(point.dataLabel),
        'Hidden point should not have a data label'
    );

    point.update({
        visible: true
    });

    assert.ok(
        !isHidden(point.graphic),
        'Hidden point should have a graphic'
    );
    assert.ok(
        !isHidden(point.dataLabel),
        'Hidden point should have a data label'
    );

    point.update({
        visible: false
    });

    assert.ok(
        isHidden(point.graphic),
        'Hidden point should not have a graphic'
    );
    assert.ok(
        isHidden(point.dataLabel),
        'Hidden point should not have a data label'
    );
});
