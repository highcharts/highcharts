QUnit.test(
    'Attributes are not deleted after updating the chart widh data (#24844)',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                column: {
                    borderWidth: 0
                }
            },
            series: [{
                data: [4, 2, 0]
            }]
        });

        chart.update({
            series: [{
                data: [2, 1]
            }]
        });

        chart.series[0].points.forEach(point => {
            const attr = point.graphic.element.getAttribute('stroke-width');

            assert.notStrictEqual(attr, null, 'Attribute should exist');
            assert.strictEqual(attr, '0', 'Attribute value should be correct');
        });
    }
);
