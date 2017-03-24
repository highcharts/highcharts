QUnit.test('Pane update, single', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            animation: false
        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: 'yellow'
            }
        },

        series: [{
            data: [100],
            animation: false
        }]

    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'yellow',
        'Initial background'
    );

    chart.pane[0].update({
        background: {
            backgroundColor: 'green'
        }
    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'green',
        'New background'
    );

    chart.pane[0].update({
        startAngle: 0,
        endAngle: 360
    });
    assert.strictEqual(
        chart.yAxis[0].startAngleRad,
        -Math.PI / 2,
        'Value axis angle is updated'
    );

    // More background props, background array definition
    chart.pane[0].update({
        background: [{
            outerRadius: '152%',
            innerRadius: '88%',
            backgroundColor: 'red',
            borderWidth: 2,
            borderColor: 'blue'
        }]
    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('stroke'),
        'blue',
        'New border color'
    );

    assert.strictEqual(
        chart.pane[0].background[0].attr('stroke-width'),
        2,
        'New border width'
    );

});

QUnit.test('Pane update through chart.update', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            animation: false
        },

        pane: [{
            center: ['25%', '50%'],
            background: {
                backgroundColor: 'yellow'
            }
        }, {
            center: ['75%', '50%'],
            background: {
                backgroundColor: 'blue'
            },
            id: 'second'
        }],

        yAxis: [{
            min: 0,
            max: 100,
            pane: 0
        }, {
            min: 0,
            max: 100,
            pane: 1
        }],

        series: [{
            data: [25],
            animation: false,
            yAxis: 0
        }, {
            data: [75],
            animation: false,
            yAxis: 1
        }]

    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'yellow',
        'Initial background'
    );

    assert.strictEqual(
        chart.pane[1].background[0].attr('fill'),
        'blue',
        'Initial background'
    );

    chart.update({
        pane: {
            background: {
                backgroundColor: 'red'
            }
        }
    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'red',
        'Single item updated, use first item'
    );

    chart.update({
        pane: [{
            background: {
                backgroundColor: 'purple'
            }
        }, {
            background: {
                backgroundColor: 'pink'
            }
        }]
    });
    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'purple',
        'Parallel array updated'
    );
    assert.strictEqual(
        chart.pane[1].background[0].attr('fill'),
        'pink',
        'Parallel array updated'
    );

    chart.update({
        pane: [{
            id: 'second',
            background: {
                backgroundColor: 'silver'
            }
        }]
    });

    assert.strictEqual(
        chart.pane[1].background[0].attr('fill'),
        'silver',
        'Pane updated by id'
    );

});

QUnit.test('Pane update, backgrounds', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            animation: false
        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{
                backgroundColor: 'yellow',
                outerRadius: '100%'
            }, {
                backgroundColor: 'red',
                outerRadius: '90%'
            }, {
                backgroundColor: 'blue',
                outerRadius: '80%'
            }]
        },

        series: [{
            data: [100],
            animation: false
        }]

    });

    assert.strictEqual(
        chart.pane[0].background.length,
        3,
        '3 backgrounds initially'
    );

    chart.pane[0].update({
        background: [{
            backgroundColor: 'purple'
        }]
    });
    assert.strictEqual(
        chart.pane[0].background.length,
        1,
        '1 backgrounds after update'
    );

    chart.pane[0].update({
        background: [{
            backgroundColor: 'purple'
        }, {
            backgroundColor: 'pink',
            outerRadius: '80%'
        }]
    });
    assert.strictEqual(
        chart.pane[0].background.length,
        2,
        '2 backgrounds after update'
    );
});
