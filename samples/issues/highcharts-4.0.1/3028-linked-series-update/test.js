/* global toggleDataLabels */
function test(chart) { // eslint-disable-line no-unused-vars
    toggleDataLabels(chart);
    chart.series[0].hide();
    chart.series[1].hide();
    chart.series[2].hide();

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}