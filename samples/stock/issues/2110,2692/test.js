function test(chart) { // eslint-disable-line no-unused-vars
    chart.rangeSelector.clickButton(0, {
        type: 'm',
        count: 1,
        _range: 30 * 24 * 36e5
    });

    var point = chart.series[0].points[2];

    // Set hoverPoint
    point.onMouseOver();

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };

}