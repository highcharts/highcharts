QUnit.test('Legend item hover - series dimming behavior.', function (assert) {

    var chart = Highcharts.chart('container', {

            chart: {
                styledMode: true
            },

            series: [{
                data: [1, 3, 2, 4]
            }, {
                data: [4, 4, 7, 1],
                visible: false
            }, {
                data: [2, 6, 1, 4]
            }]

        }),
        controller = TestController(chart),
        firstSeries = document.querySelector('.highcharts-series.highcharts-series-0'),
        legend = chart.legend,
        legendBBox = legend.group.element.getBBox(),
        boxWrapperClasses = legend.chart.renderer.boxWrapper.element.classList,
        classes = [];

    // Simulate mouse over the middle legend's element.
    controller.mouseOver(
        legend.group.translateX + legendBBox.width / 2,
        legend.group.translateY + legendBBox.height / 2
    );

    // Convert object to an array.
    boxWrapperClasses.forEach(cssClass => classes.push(cssClass));

    assert.deepEqual(
        Number(window.getComputedStyle(firstSeries).opacity),
        1,
        'Other series should not dim when we hover legend hidden series.'
    );
    assert.deepEqual(
        classes.some(cssClass => cssClass === 'highcharts-legend-series-active'),
        false,
        'Chart container should not have "highcharts-legend-series-active" class.'
    );

});