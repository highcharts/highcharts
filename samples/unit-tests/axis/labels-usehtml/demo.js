QUnit.test('Reset text with with useHTML (#4928)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            width: 100
        },
        title: {
            text: null
        },
        xAxis: {
            categories: ["Nick Presta", "Nathan Duthoit", "Jude", "Sarah", "Michael Warkentin", "Cam", "Vivian", "Brooke", "Jack", "Ash", "Andrew", "Dieter", "Brian", "Satraj", "Yoseph", "Henry", "James", "Fisher", "Cathy", "Azucena", "Katie", "Rustin", "Andrea"],
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return '<a href="#">' + this.value + '</a>';
                },
                useHTML: true
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [4, 1, 6.7, 1.2, 1.3, 1.3, 7.6, 1.85, 1.85, 2, 0.5, 1.5, 2, 4.15, 2, 1, 2, 2, 2.5, 2, 0.5, 0.5, 5]
        }],
        exporting: {
            enabled: false
        }
    });

    var labelLength = chart.xAxis[0].ticks[0].label.element.offsetWidth;
    assert.ok(
        labelLength > 20,
        'Label has length'
    );

    chart.setSize(600, 400, false);

    assert.ok(
        chart.xAxis[0].ticks[0].label.element.offsetWidth > labelLength,
        'Label has expanded'
    );

    chart.setSize(100, 400, false);

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.element.offsetWidth,
        labelLength,
        'Back to start'
    );

});


QUnit.test('Auto rotated labels with useHTML', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 310
        },

        xAxis: {
            categories: ['Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo ', 'Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar ', 'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a '],

            labels: {
                useHTML: true
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    });

    var labelLength = chart.xAxis[0].ticks[0].label.element.offsetWidth;
    assert.ok(
        labelLength > 20,
        'Label has length'
    );

    chart.setSize(300, 400, false);

    assert.ok(
        chart.plotHeight > 100,
        'Plot height is ok'
    );

});

QUnit.test('Bounding box for rotated label', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 400
        },
        title: {
            text: 'with useHTML enabled on Axis labels'
        },
        xAxis: {
            categories: ['This really looooong title name will be cut off', 'Feb'],
            labels: {
                useHTML: true,
                rotation: 45,
                style: {
                    textOverflow: 'none',
                    whiteSpace: "nowrap"
                }
            }
        },
        series: [{
            data: [29.9, 71.5]
        }]
    });

    var label = chart.xAxis[0].ticks[0].label.element;
    assert.strictEqual(
        label.style.whiteSpace,
        'nowrap',
        'The white-space is set'
    );
    assert.strictEqual(
        label.style.width,
        '',
        'The width should not be set when white-space is nowrap (#8467)'
    );
});

QUnit.test('Resizing chart with HTML labels (#8789)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            type: 'column',
            width: 1000,
            height: 400
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            labels: {
                useHTML: true
            },
            type: 'category'
        },
        series: [{
            name: 'Average Sale Price',
            data: [{
                name: 'T00 (00.0,00.0)',
                y: 44.46
            },
            {
                name: 'T01 [00.0,10.0)',
                y: 81.33
            },
            {
                name: 'T02 [10.0,20.0)',
                y: 77.09
            },
            {
                name: 'T03 [20.0,30.0)',
                y: 68.43
            },
            {
                name: 'T04 [30.0,40.0)',
                y: 49.29
            },
            {
                name: 'T05 [40.0,50.0)',
                y: 53.11
            },
            {
                name: 'T06 [50.0,60.0)',
                y: 70.07
            },
            {
                name: 'T07 [60.0,70.0)',
                y: 75.05
            },
            {
                name: 'T08 [70.0,80.0)',
                y: 110.64
            },
            {
                name: 'T09 [80.0,90.0)',
                y: 87.78
            },
            {
                name: 'T10 [90.0,00.9)',
                y: 109.00
            }]
        }]
    });

    assert.ok(
        chart.plotHeight > 200,
        'Plot height should be more than 200'
    );

    chart.setSize(950);
    assert.ok(
        chart.plotHeight > 200,
        'Plot height should still be more than 200 after resize'
    );
});