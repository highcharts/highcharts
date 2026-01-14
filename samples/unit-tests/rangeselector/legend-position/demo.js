QUnit.test(
    'Legend should be rendered below the range selector',
    function (assert) {
        const chart = Highcharts.stockChart('container', {
            chart: {
                width: 350
            },
            rangeSelector: {
                dropdown: 'never',
                inputPosition: {
                    align: 'right'
                },
                buttonPosition: {
                    align: 'left'
                }
            },
            legend: {
                enabled: true,
                align: 'left',
                verticalAlign: 'top'
            },
            series: [
                {
                    data: [101, 343, 11]
                }
            ]
        });

        assert.ok(
            chart.legend.group.element.getBoundingClientRect().top >=
                chart.rangeSelector.group.element.getBoundingClientRect()
                    .bottom,
            'The legend is rendered below the range selector.'
        );

        assert.ok(
            chart.plotTop >
                chart.rangeSelector.getHeight() + chart.legend.legendHeight,
            'Top aligned legend should not overlap into plotArea, #23058.'
        );
    }
);
