QUnit.test(
    'Legend border should contain items with checkboxes (#4853)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                animation: false
            },
            legend: {
                borderWidth: 1,
                itemDistance: 80
            },
            plotOptions: {
                series: {
                    showCheckbox: true
                }
            },

            series: [{
                data: [1, 2, 3]
            }, {
                data: [4, 3, 2]
            }]
        });

        assert.strictEqual(
            chart.legend.box.getBBox().width > 340 && chart.legend.box.getBBox().width < 360,
            true,
            'Legend box contains checkboxes - 2 items'
        );

        chart.series[0].remove();

        assert.strictEqual(
            chart.legend.box.getBBox().width > 170 && chart.legend.box.getBBox().width < 190,
            true,
            'Legend box contains checkbox - 1 item'
        );

        chart.update({
            plotOptions: {
                series: {
                    showCheckbox: false
                }
            }
        });

        assert.strictEqual(
            chart.legend.box.getBBox().width > 70 && chart.legend.box.getBBox().width < 90,
            true,
            'Legend box without checkboxes is of proper size - 1 item'
        );

        chart.addSeries({
            data: [5, 2, 4]
        });
        chart.addSeries({
            data: [15, 12, 14]
        });
        chart.addSeries({
            data: [2, 2, 2]
        });

        assert.strictEqual(
            chart.legend.box.getBBox().width > 370 && chart.legend.box.getBBox().width < 395,
            true,
            'Legend box without checkboxes is of proper size - 4 items'
        );

        chart.update({
            plotOptions: {
                series: {
                    showCheckbox: true
                }
            }
        });

        assert.strictEqual(
            chart.legend.box.getBBox().width > 510 && chart.legend.box.getBBox().width < 535,
            true,
            'Legend box contains checkboxes - 4 items'
        );
    }
);

QUnit.test(
    'Position checkboxes in navigator after series.update',
    function (assert) {
        var chart = new Highcharts.chart('container', {

            chart: {
                type: 'pie',
                width: 500
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                y: 30
            },

            series: [{
                data: Highcharts.map(new Array(50), Math.random),
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
                showCheckbox: false
            }]

        });

        chart.legend.scroll(2, false);

        chart.series[0].update({
            showCheckbox: true
        });

        var points = chart.series[0].points;
        assert.ok(
            parseInt(points[0].checkbox.style.top, 10) < -100,
            'Check box has scrolled with content'
        );
    }
);

// Highcharts 4.1.10, Issue #4811:
// Incorect checkboxes position with legend's title
QUnit.test('Legend checkbox position with title (#4811)', function (assert) {

    var chart = $("#container").highcharts({
        chart: {},
        legend: {
            title: {
                text: 'Click line'
            },
            layout: 'vertical',
            align: 'left'
        },
        plotOptions: {
            series: {
                showCheckbox: true
            }
        },
        series: [{
            data: [1, 3, 2, 4]
        }]
    }).highcharts();

    assert.ok(
        parseInt(chart.series[0].checkbox.style.top, 10) > chart.legend.group.translateY + chart.legend.titleHeight,
        'Checkbox should be below the title'
    );

});
