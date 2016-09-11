function test(chart) { // eslint-disable-line no-unused-vars
    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}