QUnit.test(
    'Legend items and checkboxes',
    function (assert) {
        const countBoxes = legend =>
            legend.allItems
                .filter(item => item.checkbox?.parentElement)
                .length;

        const chart = Highcharts.chart('container', {
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

            series: [
                {
                    data: [1, 2, 3]
                },
                {
                    data: [4, 3, 2]
                }
            ]
        });

        assert.strictEqual(
            countBoxes(chart.legend),
            2,
            'Legend box contains checkboxes - 2 items'
        );

        chart.series[0].remove();

        assert.strictEqual(
            countBoxes(chart.legend),
            1,
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
            countBoxes(chart.legend) === 0 &&
                chart.legend.box.getBBox().width > 70 &&
                chart.legend.box.getBBox().width < 90,
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
            countBoxes(chart.legend) === 0 &&
                chart.legend.allItems.length === 4,
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
            countBoxes(chart.legend),
            4,
            'Legend box contains checkboxes - 4 items'
        );

        chart.legend.update({
            layout: 'vertical'
        });

        assert.strictEqual(
            countBoxes(chart.legend),
            4,
            'Check boxes should survive legend.update (#22415)'
        );
    }
);

QUnit.test(
    'Position checkboxes in navigator after series.update',
    function (assert) {
        var data = [];

        for (var i = 0, ie = 50; i < ie; ++i) {
            data[i] = Math.random();
        }

        var chart = new Highcharts.Chart('container', {
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

            series: [
                {
                    data,
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    showCheckbox: false
                }
            ]
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
    var chart = $('#container')
        .highcharts({
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
            series: [
                {
                    data: [1, 3, 2, 4]
                }
            ]
        })
        .highcharts();

    assert.ok(
        parseInt(chart.series[0].checkbox.style.top, 10) >
            chart.legend.group.translateY + chart.legend.titleHeight,
        'Checkbox should be below the title'
    );
});

QUnit.test(
    'Legend layout proximate with check boxes (#9091)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    showCheckbox: true
                }
            },
            legend: {
                layout: 'proximate',
                align: 'right'
            },
            yAxis: {
                min: 100
            },
            series: [
                {
                    data: [
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4
                    ],
                    selected: true
                },
                {
                    data: [
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4,
                        29.9,
                        71.5,
                        106.4,
                        129.2
                    ]
                }
            ]
        });

        assert.notEqual(
            chart.series[0].checkbox.style.display,
            'none',
            'The checkbox should be visible'
        );

        assert.notEqual(
            chart.series[1].checkbox.style.display,
            'none',
            'The checkbox should be visible'
        );
    }
);
