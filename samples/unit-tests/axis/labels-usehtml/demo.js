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