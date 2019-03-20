

QUnit.test('Legend object set to false (#5215)', function (assert) {

    // We only expect it to render without a JS error, that's all
    assert.expect(0);
    Highcharts.chart('container', {

        legend: false,

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    });
});

QUnit.test('Spacing and legend overflow (#6497)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            spacing: [10, 200, 15, 0]
        },

        series: [{
            showInLegend: true,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7]
        }]

    });
    assert.ok(
        chart.legend.group.attr('translateX') > chart.spacing[3],
        'Legend is within spacing'
    );
});

QUnit.test('Hidden legend bogus SVG (#6769', function (assert) {

    var chart = Highcharts.chart('container', {
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        yAxis: {
            visible: false
        },
        xAxis: {
            visible: false
        },
        series: [{
            data: [1],
            visible: false
        }]
    });

    assert.strictEqual(
        chart.container.innerHTML.indexOf('stroke-width="#'),
        -1,
        'No bogus stroke-width found'
    );

});

QUnit.test('Legend resize', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            animation: {
                duration: 1
            }
        },
        legend: {
            borderWidth: 2
        },
        series: [{
            data: [1, 3, 2, 4]
        }]
    });
    var done = assert.async();

    var legendWidth = chart.legend.box.getBBox().width;

    chart.addSeries({
        data: [2, 4, 3, 5]
    });

    setTimeout(function () {
        assert.notEqual(
            chart.legend.box.getBBox().width,
            legendWidth,
            'Legend width has changed (#7260)'
        );
        done();
    }, 50);
});



QUnit.test('Legend redraws', function (assert) {
    var visible = true,
        chart = Highcharts.chart('container', {
            legend: {
                labelFormatter: function () {
                    visible = this.visible;
                    return this.visible;
                }
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

    chart.series[0].hide(true);

    assert.strictEqual(
        visible,
        false,
        'Legend item text has changed (#2165)'
    );
});