
QUnit.test(
    'Redraw parameter on stock chart (#7256)',
    function (assert) {
        var redrawTriggered = false;
        var chart = Highcharts.stockChart('container', {
            chart: {
                events: {
                    redraw: function () {
                        redrawTriggered = true;
                    }
                }
            },
            series: [{
                id: 'series1',
                data: [1, 3, 2, 4, 3, 5]
            }]
        });

        // Toggle on and off, no redraw
        chart.series[0].setVisible(false, false);
        chart.series[0].setVisible(true, false);

        assert.strictEqual(
            redrawTriggered,
            false,
            'Redraw not triggered'
        );


        // Toggle on and off with redraw
        chart.series[0].setVisible(false);
        chart.series[0].setVisible(true);

        assert.strictEqual(
            redrawTriggered,
            true,
            'Redraw triggered'
        );

    }
);
