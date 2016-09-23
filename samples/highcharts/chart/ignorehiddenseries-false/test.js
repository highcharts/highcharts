function test(chart) { // eslint-disable-line no-unused-vars
    chart.series[0].hide();

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}