QUnit.test('Legend item hover - series dimming behavior.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                styledMode: true,
                width: 600
            },

            series: [
                {
                    data: [1, 3, 2, 4]
                },
                {
                    data: [4, 4, 7, 1],
                    visible: false
                },
                {
                    id: 's',
                    data: [2, 6, 1, 4]
                },
                {
                    linkedTo: 's',
                    data: [3, 4, 1, 6]
                }
            ]
        }),
        controller = new TestController(chart),
        firstSeries = document.querySelector(
            '.highcharts-series.highcharts-series-0'
        ),
        legend = chart.legend,
        classes = legend.chart.renderer.boxWrapper.element
            .getAttribute('class')
            .split(/\s/g);

    const getLegendItemCenter = seriesIndex => {
        const legendItem = chart.series[seriesIndex].legendItem,
            labelBBox = legendItem.label.getBBox();
        return [
            legend.group.translateX +
                legendItem.group.translateX +
                legendItem.label.attr('x') +
                labelBBox.width / 2,
            legend.group.translateY +
                legendItem.group.translateY +
                4 +
                labelBBox.height / 2,
            void 0,
            true
        ];
    };

    // Simulate mouse over the middle legend's element.
    controller.mouseOver.apply(controller, getLegendItemCenter(1));

    assert.deepEqual(
        Number(window.getComputedStyle(firstSeries).opacity),
        1,
        'Other series should not dim when we hover legend hidden series.'
    );
    assert.deepEqual(
        classes.some(
            cssClass => cssClass === 'highcharts-legend-series-active'
        ),
        false,
        'Chart container should not have "highcharts-legend-series-active" ' +
        'class.'
    );

    controller.mouseOver.apply(controller, getLegendItemCenter(0));

    assert.strictEqual(
        chart.series[3].state,
        'inactive',
        '#12015: Linked series should have inactive state applied'
    );
});
