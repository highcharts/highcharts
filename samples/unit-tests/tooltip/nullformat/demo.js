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


QUnit.test('#10874: update null point with non-null values.',
    function (assert) {
        var pointFormat = 'Value is available.',
            chart = Highcharts.chart('container', {
                series: [{
                    data: [null],
                    tooltip: {
                        pointFormat: pointFormat
                    }
                }]
            });

        chart.series[0].points[0].update(1);
        chart.tooltip.refresh(chart.series[0].points[0]);

        assert.ok(
            chart.tooltip.label.text.textStr.indexOf(pointFormat) > -1,
            '#10874: Toolip for updated null point has correct formatting.'
        );
    });
