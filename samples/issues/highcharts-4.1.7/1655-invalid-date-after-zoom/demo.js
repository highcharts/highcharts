$(function () {
    QUnit.test("setExtremes shouldn't return undefined min or max after zooming." , function (assert) {
        var min,
            max,
            UNDEFINED,
            chart = new Highcharts.StockChart({
                chart: {
                    renderTo: 'container',
                    zoomType: 'x'
                },

                series: [{
                    data: [
                        [Date.UTC(2011, 1), 1],
                        [Date.UTC(2012, 1), 1]
                    ]
                }],

                xAxis: {
                    events: {
                        setExtremes: function (event) {
                            min = event.min;
                            max = event.max;
                        }
                    }
                }
            });

        // Set testing extremes:
        chart.xAxis[0].setExtremes(Date.UTC(2010, 1),Date.UTC(2013, 1), true, false);

        // Imitate left side zooming:
        chart.pointer.selectionMarker = chart.renderer.rect(chart.plotLeft + 50, chart.plotTop, 200, chart.plotHeight).add();
        chart.pointer.hasDragged = true;
        chart.pointer.drop({});

        // Test:
        assert.strictEqual(
            min !== UNDEFINED,
            true,
            'Proper minimum'
        );

        // Reset extremes for a second test:
        chart.xAxis[0].setExtremes(Date.UTC(2010, 1),Date.UTC(2013, 1), true, false);

        // Imitate right side zooming:
        chart.pointer.selectionMarker = chart.renderer.rect(chart.plotLeft + 200, chart.plotTop, 200, chart.plotHeight).add();
        chart.pointer.hasDragged = true;
        chart.pointer.drop({});

        // Test:
        assert.strictEqual(
            max !== UNDEFINED,
            true,
            'Proper maximum'
        );
    });
});