
QUnit.test(
    'Redraw parameter on stock chart (#7256)',
    function (assert) {
        var redrawTriggered = 0;
        var chart = Highcharts.stockChart('container', {
            chart: {
                events: {
                    redraw: function () {
                        redrawTriggered++;
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
            0,
            'Redraw not triggered'
        );


        // Toggle on and off with redraw
        chart.series[0].setVisible(false);

        assert.strictEqual(
            redrawTriggered,
            1,
            'Redraw triggered'
        );

        chart.series[0].setVisible(true);

        assert.strictEqual(
            redrawTriggered,
            2,
            'Redraw triggered'
        );

    }
);
