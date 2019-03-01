QUnit.test('#9233: Support for visible null points formatting in tooltip.',
    function (assert) {
        var nullPointText = 'Value not available.',
            chart = Highcharts.chart('container', {
                series: [{
                    type: 'heatmap',
                    data: [
                        [0, 0, null]
                    ],
                    tooltip: {
                        nullFormat: nullPointText
                    }
                }]
            });

        chart.tooltip.refresh(chart.series[0].points[0]);

        assert.strictEqual(
            chart.tooltip.label.text.textStr.indexOf(nullPointText) > -1,
            true,
            '#9233: Toolip for null point contains the given formatting.'
        );
    });
